'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ServicesErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ServicesError({ error, reset }: ServicesErrorProps) {
  useEffect(() => {
    console.error('Services page error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <AlertTriangle className="h-16 w-16 text-red-500" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">
            Có lỗi xảy ra
          </h2>
          <p className="text-gray-600">
            Không thể tải trang quản lý dịch vụ. Vui lòng thử lại sau.
          </p>
          {error.message && (
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded">
              Chi tiết lỗi: {error.message}
            </p>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Thử lại
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/dashboard'}
          >
            Về trang chủ
          </Button>
        </div>
      </div>
    </div>
  );
}