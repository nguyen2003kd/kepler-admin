import { useEffect } from 'react';
import { useGetApiV10AuthProfile } from '@/api/endpoints/authentication';
import useAuthStore from '@stores/auth';
import { clearAuthPresenceCookie } from '@/lib/auth-cookie';
const useSyncUserProfile = () => {
  const setStore = useAuthStore((state) => state.setStore);
  const auth = useAuthStore();
  const resetStore = useAuthStore((state) => state.resetStore);
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;
  const { data, error } = useGetApiV10AuthProfile({
    query: {
       enabled: !!(token && auth.email), //
    },
  });

  useEffect(() => {
    if (data?.data) {
      setStore({
        id: data.data.id ?? undefined,
        email: data.data.email ?? undefined,
        username: data.data.username ?? undefined,
        first_name: undefined,
        last_name: undefined,
        roles: data.data.role ? [data.data.role] : undefined,
        permissions: data.data.permissions ?? undefined,
      });
    }

    if (error) {
      resetStore();
      localStorage.removeItem('auth-token');
      clearAuthPresenceCookie();
    }
  }, [data, error, setStore, resetStore]);
};

export default useSyncUserProfile;