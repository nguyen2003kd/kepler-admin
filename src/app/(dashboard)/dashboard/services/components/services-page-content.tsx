'use client';

import { useEffect, useState } from 'react';
import { Plus, Download, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card } from '@/components/ui/card';
import { Header } from '@/components/layout/header';
import { toast } from 'sonner';

import type { 
  Service, 
  ServiceFilters as ServiceFiltersType, 
  ServiceFormData, 
  ServiceStats,
} from '../lib/types';
import {
  getServices,
  getServiceStatistics,
  createService,
  updateService,
  deleteService,
  updateServiceStatus,
  bulkUpdateServiceStatus,
  bulkDeleteServices,
} from '../lib/api';
import { 
  SERVICE_FORM_LABELS, 
  SERVICE_SUCCESS_MESSAGES, 
  SERVICE_ERROR_MESSAGES,
} from '../lib/constants';

import ServiceTable from './service-table';
import ServiceForm from './service-form';
import ServiceFilters from './service-filters';
import DeleteServiceDialog from './delete-service-dialog';

export default function ServicesPageContent() {
  // State management
  const [services, setServices] = useState<Service[]>([]);
  const [stats, setStats] = useState<ServiceStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Filters and pagination
  const [filters, setFilters] = useState<ServiceFiltersType>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalServices, setTotalServices] = useState(0);
  
  // UI state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);

  // Load services data
  const loadServices = async (page: number = currentPage) => {
    setIsLoading(true);
    try {
      const result = await getServices(filters, undefined, page, 20);
      setServices(result.services);
      setCurrentPage(result.page);
      setTotalPages(result.totalPages);
      setTotalServices(result.total);
    } catch (error) {
      console.error('Error loading services:', error);
      toast.error(SERVICE_ERROR_MESSAGES.loadFailed);
    } finally {
      setIsLoading(false);
    }
  };

  // Load statistics
  const loadStatistics = async () => {
    try {
      const statistics = await getServiceStatistics();
      setStats(statistics);
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  // Initial load
  useEffect(() => {
    const init = async () => {
      await loadServices();
      await loadStatistics();
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reload when filters change
  useEffect(() => {
    setCurrentPage(1);
    const loadData = async () => {
      await loadServices(1);
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // Handle create service
  const handleCreateService = () => {
    setSelectedService(null);
    setIsFormOpen(true);
  };

  // Handle edit service
  const handleEditService = (service: Service) => {
    setSelectedService(service);
    setIsFormOpen(true);
  };

  // Handle delete service
  const handleDeleteService = (service: Service) => {
    setSelectedService(service);
    setIsDeleteDialogOpen(true);
  };

  // Handle form submit
  const handleFormSubmit = async (data: ServiceFormData) => {
    try {
      // Convert FileList to string arrays if needed (for now just use empty arrays)
      const processedData = {
        serviceCode: data.serviceCode,
        name: data.name,
        categoryId: data.categoryId,
        serviceTypeId: data.serviceTypeId,
        content: data.content,
        images: Array.isArray(data.images) ? data.images : [],
        videos: Array.isArray(data.videos) ? data.videos : [],
        status: data.status,
      };

      if (selectedService) {
        // Update existing service
        setIsUpdating(true);
        await updateService({ ...processedData, id: selectedService.id });
        toast.success(SERVICE_SUCCESS_MESSAGES.updated);
      } else {
        // Create new service
        setIsCreating(true);
        await createService(processedData);
        toast.success(SERVICE_SUCCESS_MESSAGES.created);
      }
      
      // Reload data
      await Promise.all([loadServices(), loadStatistics()]);
      setIsFormOpen(false);
      
    } catch (error) {
      const message = error instanceof Error ? error.message : 
        (selectedService ? SERVICE_ERROR_MESSAGES.updateFailed : SERVICE_ERROR_MESSAGES.createFailed);
      toast.error(message);
    } finally {
      setIsCreating(false);
      setIsUpdating(false);
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!selectedService) return;
    
    try {
      setIsDeleting(true);
      await deleteService(selectedService.id);
      toast.success(SERVICE_SUCCESS_MESSAGES.deleted);
      
      // Reload data
      await Promise.all([loadServices(), loadStatistics()]);
      setIsDeleteDialogOpen(false);
      
    } catch (error) {
      const message = error instanceof Error ? error.message : SERVICE_ERROR_MESSAGES.deleteFailed;
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle status change
  const handleStatusChange = async (service: Service, status: 'active' | 'inactive') => {
    try {
      await updateServiceStatus(service.id, status);
      toast.success(SERVICE_SUCCESS_MESSAGES.statusChanged);
      
      // Reload data
      await Promise.all([loadServices(), loadStatistics()]);
      
    } catch (error) {
      const message = error instanceof Error ? error.message : SERVICE_ERROR_MESSAGES.updateFailed;
      toast.error(message);
    }
  };

  // Handle filters change
  const handleFiltersChange = (newFilters: ServiceFiltersType) => {
    setFilters(newFilters);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setFilters({});
  };

  // Handle bulk operations
  const handleBulkStatusChange = async (status: 'active' | 'inactive') => {
    if (selectedServiceIds.length === 0) {
      toast.error('Vui lòng chọn ít nhất 1 dịch vụ');
      return;
    }

    try {
      await bulkUpdateServiceStatus(selectedServiceIds, status);
      toast.success(SERVICE_SUCCESS_MESSAGES.bulkStatusChanged);
      
      // Reload data and clear selection
      await Promise.all([loadServices(), loadStatistics()]);
      setSelectedServiceIds([]);
      
    } catch (error) {
      const message = error instanceof Error ? error.message : SERVICE_ERROR_MESSAGES.updateFailed;
      toast.error(message);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedServiceIds.length === 0) {
      toast.error('Vui lòng chọn ít nhất 1 dịch vụ');
      return;
    }

    try {
      const deletedCount = await bulkDeleteServices(selectedServiceIds);
      
      if (deletedCount === 0) {
        toast.error('Không thể xóa dịch vụ nào. Chỉ có thể xóa dịch vụ đang ngừng hoạt động.');
      } else if (deletedCount < selectedServiceIds.length) {
        toast.warning(`Đã xóa ${deletedCount} dịch vụ. ${selectedServiceIds.length - deletedCount} dịch vụ không thể xóa vì đang hoạt động.`);
      } else {
        toast.success(SERVICE_SUCCESS_MESSAGES.bulkDeleted);
      }
      
      // Reload data and clear selection
      await Promise.all([loadServices(), loadStatistics()]);
      setSelectedServiceIds([]);
      
    } catch (error) {
      const message = error instanceof Error ? error.message : SERVICE_ERROR_MESSAGES.deleteFailed;
      toast.error(message);
    }
  };

  return (
    <div>
      <Header title="Quản lý dịch vụ" />
      <main className="container mx-auto p-4 md:p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Quản lý dịch vụ</h1>
              <p className="text-gray-600 mt-2">
                Quản lý toàn bộ dịch vụ kiểm định và thử nghiệm chất lượng
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Bulk Actions */}
              {selectedServiceIds.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <MoreHorizontal className="h-4 w-4 mr-2" />
                      Thao tác ({selectedServiceIds.length})
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleBulkStatusChange('active')}>
                      Kích hoạt tất cả
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkStatusChange('inactive')}>
                      Ngừng hoạt động tất cả
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleBulkDelete}
                      className="text-red-600"
                    >
                      Xóa tất cả
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Xuất Excel
              </Button>
              
              <Button onClick={handleCreateService}>
                <Plus className="h-4 w-4 mr-2" />
                {SERVICE_FORM_LABELS.create}
              </Button>
            </div>
          </div>

          {/* Statistics Cards */}
          {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <Card className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.totalServices}</div>
            <div className="text-sm text-gray-600">Tổng dịch vụ</div>
          </Card>
          
          <Card className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.activeServices}</div>
            <div className="text-sm text-gray-600">Đang hoạt động</div>
          </Card>
          
          <Card className="p-4">
            <div className="text-2xl font-bold text-gray-600">{stats.inactiveServices}</div>
            <div className="text-sm text-gray-600">Ngừng hoạt động</div>
          </Card>
          
          <Card className="p-4">
            <div className="text-2xl font-bold text-purple-600">{stats.totalCategories}</div>
            <div className="text-sm text-gray-600">Danh mục</div>
          </Card>
          
          <Card className="p-4">
            <div className="text-2xl font-bold text-orange-600">{stats.totalServiceTypes}</div>
            <div className="text-sm text-gray-600">Loại dịch vụ</div>
          </Card>
          
          <Card className="p-4">
            <div className="text-2xl font-bold text-indigo-600">{stats.recentlyAdded}</div>
            <div className="text-sm text-gray-600">Thêm gần đây</div>
          </Card>
        </div>
      )}

          {/* Filters */}
          <Card className="p-4">
            <ServiceFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
              isLoading={isLoading}
            />
          </Card>

          {/* Service Table */}
          <Card className="p-6">
            <ServiceTable
              services={services}
              isLoading={isLoading}
              onEdit={handleEditService}
              onDelete={handleDeleteService}
              onStatusChange={handleStatusChange}
              onSelectionChange={setSelectedServiceIds}
            />
            
            {/* Pagination Info */}
            {!isLoading && totalServices > 0 && (
              <div className="mt-4 text-sm text-gray-600">
                Hiển thị {services.length} trong tổng số {totalServices} dịch vụ
                {totalPages > 1 && ` (Trang ${currentPage}/${totalPages})`}
              </div>
            )}
          </Card>

          {/* Service Form Dialog */}
          <ServiceForm
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            onSubmit={handleFormSubmit}
            service={selectedService}
            isLoading={isCreating || isUpdating}
          />

          {/* Delete Confirmation Dialog */}
          <DeleteServiceDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            onConfirm={handleDeleteConfirm}
            service={selectedService}
            isLoading={isDeleting}
          />
        </div>
      </main>
    </div>
  );
}
