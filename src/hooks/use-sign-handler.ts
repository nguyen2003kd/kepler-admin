import { useCallback, useMemo } from 'react'
import useAuthStore from '@/stores/auth'
import { usePostApiV10AuthLogin } from '@/api/endpoints/authentication'
import { setAuthPresenceCookie } from '@/lib/auth-cookie'
// import type { PostApiV10AuthLoginMutationResult } from '@/api/endpoints/authentication'

// Custom interface for the actual API response structure
export type User = {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  roles: string[];
  permissions: string[];
  status: string;
  last_login_at: string;
};
export type LoginResponse = {
  message: string;
  message_en: string;
  responseData: {
    user: User;
    session: {
      id: string;
      expires_at: string;
      refresh_expires_at: string;
    };
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
  };
  status: string;
  timeStamp: string;
  violations: null | Record<string, unknown>;
};



const useSignInHandler = () => {
  const { mutateAsync: signIn, isPending } = usePostApiV10AuthLogin()
  const setStore = useAuthStore((state) => state.setStore)
  const resetStore = useAuthStore((state) => state.resetStore)

  const defaultValue = useMemo(
    () => ({
      email: '',
      password: ''
    }),
    []
  )

  const signInHandler = useCallback(
    async (fieldValues: { email: string; password: string }) => {
      try {
        const response = await signIn({
          data: {
            email: fieldValues.email,
            password: fieldValues.password
          }
        })as unknown as LoginResponse
     if (response.status === 'fail') {
          throw {
            response: {
              data: response
            }
          }
        }
  
          if (response.status === "success" && response.message) {
            setAuthPresenceCookie()
            setStore({
              id: response.responseData.user.id ?? undefined,
              email: response.responseData.user.email ?? undefined,
              username: response.responseData.user.username ?? undefined,
              first_name: response.responseData.user.first_name ?? undefined,
              last_name: response.responseData.user.last_name ?? undefined,
              roles: response.responseData.user.roles ?? undefined,
              permissions: response.responseData.user.permissions ?? undefined,
              status: response.responseData.user.status ?? undefined,
              last_login_at: response.responseData.user.last_login_at ?? undefined,
              session: response.responseData.session ?? undefined,
              access_token: response.responseData.access_token ?? undefined,
              refresh_token: response.responseData.refresh_token ?? undefined,
              expires_in: response.responseData.expires_in ?? undefined,
              token_type: response.responseData.token_type ?? undefined,
            })
        }

        return response
      } catch (error) {
        resetStore()
        throw error
      }
    },
    [signIn, setStore, resetStore]
  )

  return {
    defaultValue,
    signInHandler,
    isPending
  }
}

export default useSignInHandler