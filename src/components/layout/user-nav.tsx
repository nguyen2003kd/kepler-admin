'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  // DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { postApiV10AuthLogout } from '@/api/endpoints/authentication';
import useAuthStore from '@/stores/auth';
import { clearAuthPresenceCookie } from '@/lib/auth-cookie';
interface UserNavProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export function UserNav({ user }: UserNavProps) {
  const router = useRouter();
  const auth = useAuthStore();

  const handleLogout = async () => {
    try {
      await postApiV10AuthLogout();
    } catch (err) {
      console.error('Logout API error:', err);
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-token');
        clearAuthPresenceCookie();
      }
      router.push('/login');
    }
  };

  const initials = auth?.first_name
    ? auth.first_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'AD';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.avatar} alt={user?.name || 'User'} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {auth?.first_name || 'Admin User'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {auth?.email || 'admin@example.com'}
            </p>
          </div>
        </DropdownMenuLabel>
        {/* <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator /> */}
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
