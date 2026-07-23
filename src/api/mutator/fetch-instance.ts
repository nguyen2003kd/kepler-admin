import axios, { AxiosError, AxiosRequestConfig,InternalAxiosRequestConfig } from 'axios'
import baseConfig from '../../configs/base'
import { toast } from '@/components/ui/toaster'
import { clearAuthPresenceCookie } from '@/lib/auth-cookie'
const fetchAxiosInstance = axios.create({
    baseURL: baseConfig.backendDomain,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
})
fetchAxiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Clear auth data and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-token');
        clearAuthPresenceCookie();
        window.location.href = '/admin/login'
        toast.warning({ title: 'Phiên đăng nhập đã hết hạn', content: 'Vui lòng đăng nhập lại để tiếp tục.' })
      }
    }

    // Handle other errors
    const errorMessage = 
      (error.response?.data as Record<string, unknown>)?.message || 
      error.message || 
      'An unexpected error occurred';

    return Promise.reject({
      status: error.response?.status,
      message: errorMessage,
      data: error.response?.data,
    });
  }
);
export function fetchInstance(config: AxiosRequestConfig) {
    return fetchAxiosInstance(config)
}