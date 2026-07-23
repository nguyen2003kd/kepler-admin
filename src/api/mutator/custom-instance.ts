import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'
import baseConfig from '../../configs/base'
import { toast } from '@/components/ui/toaster'
import { clearAuthPresenceCookie } from '@/lib/auth-cookie'
import useAuthStore from '@/stores/auth'

const mainAxiosInstance = axios.create({
    baseURL: baseConfig.backendDomain,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Track if refresh token request is in progress
let isRefreshing = false
// Queue of requests to retry after token refresh
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (error?: unknown) => void
}> = []

// Process queue after token refresh
const processQueue = (error: unknown) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve()
    }
  })
  failedQueue = []
}

// Add request interceptor to attach access token
mainAxiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const access_token = useAuthStore.getState().access_token
      if (access_token) {
        config.headers = config.headers || {}
        config.headers.Authorization = `Bearer ${access_token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Add response interceptor for token refresh
mainAxiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // Ensure headers exists
    originalRequest.headers = originalRequest.headers || {}

    // Handle 401/403 Unauthorized - attempt token refresh
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Skip refresh for auth endpoints to avoid infinite loops
      const isAuthEndpoint = originalRequest.url?.includes('/auth/login') ||
        originalRequest.url?.includes('/auth/register') ||
        originalRequest.url?.includes('/auth/refresh') ||
        originalRequest.url?.includes('/auth/logout')

      // Skip for auth endpoints - let them fail normally
      if (isAuthEndpoint) {
        return Promise.reject(error)
      }

      // If already retried, clear auth and redirect to login
      if (originalRequest._retry) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-token')
          clearAuthPresenceCookie()
          useAuthStore.getState().resetStore()
          toast.warning({
            title: 'Phiên đăng nhập đã hết hạn',
            content: 'Vui lòng đăng nhập lại để tiếp tục.'
          })
          window.location.href = '/admin/login'
        }
        return Promise.reject(error)
      }

      // Queue this request while refresh is in progress
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(() => {
          const access_token = useAuthStore.getState().access_token
          originalRequest.headers.Authorization = `Bearer ${access_token}`
          return mainAxiosInstance(originalRequest)
        }).catch((err) => {
          return Promise.reject(err)
        })
      }

      // Mark request as retried and start refresh
      originalRequest._retry = true
      isRefreshing = true

      try {
        const refresh_token = useAuthStore.getState().refresh_token

        if (!refresh_token) {
          throw new Error('No refresh token available')
        }

        // Call refresh token API
        const response = await axios.post(
          `${baseConfig.backendDomain}/api/v1.0/auth/refresh`,
          { refresh_token },
          { headers: { 'Content-Type': 'application/json' } }
        )

        const data = response.data as {
          success?: boolean
          data?: {
            access_token?: string
            refresh_token?: string
            expires_in?: number
            token_type?: string
          }
        }

        if (data.success && data.data) {
          // Update auth store with new tokens
          useAuthStore.getState().setStore({
            access_token: data.data.access_token ?? undefined,
            refresh_token: data.data.refresh_token ?? undefined,
            expires_in: data.data.expires_in ?? undefined,
            token_type: data.data.token_type ?? undefined,
          })
        } else {
          throw new Error('Refresh token failed')
        }

        // Process queued requests with new tokens
        processQueue(null)

        // Retry original request with new token
        const access_token = useAuthStore.getState().access_token
        originalRequest.headers.Authorization = `Bearer ${access_token}`
        return mainAxiosInstance(originalRequest)

      } catch (refreshError) {
        // Refresh failed - process queue with error
        processQueue(refreshError)

        // Clear auth and redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-token')
          clearAuthPresenceCookie()
          useAuthStore.getState().resetStore()
          toast.warning({
            title: 'Phiên đăng nhập đã hết hạn',
            content: 'Vui lòng đăng nhập lại để tiếp tục.'
          })
          window.location.href = '/admin/login'
        }
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // Handle other errors
    const errorMessage =
      (error.response?.data as Record<string, unknown>)?.message ||
      error.message ||
      'An unexpected error occurred'

    return Promise.reject({
      status: error.response?.status,
      message: errorMessage,
      data: error.response?.data,
    })
  }
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mainInstance<T = any>(config: AxiosRequestConfig): Promise<T> {
    return mainAxiosInstance(config).then(res => res.data)
}
