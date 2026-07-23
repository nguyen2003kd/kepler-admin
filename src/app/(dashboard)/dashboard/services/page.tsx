// Main services management page - Quản lý dịch vụ
import { Metadata } from 'next';
import { Suspense } from 'react';
import { constructMetadata } from '@/lib/seo';
import ServicesPageContent from './components/services-page-content';

// Page metadata (REQUIRED cho SEO)
export const metadata: Metadata = constructMetadata({
  title: 'Quản lý dịch vụ',
  description: 'Quản lý danh mục dịch vụ kiểm định và thử nghiệm chất lượng',
  url: '/dashboard/services',
});

// Loading fallback
function ServicesPageLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-sm text-gray-500">Đang tải...</p>
      </div>
    </div>
  );
}

// Main page component
export default function ServicesPage() {
  return (
    <Suspense fallback={<ServicesPageLoading />}>
      <ServicesPageContent />
    </Suspense>
  );
}