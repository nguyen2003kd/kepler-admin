'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import { serviceFormSchema, type ServiceFormData } from '../lib/validations';
import { SERVICE_FORM_LABELS, SERVICE_ERROR_MESSAGES } from '../lib/constants';
import type { Service, ServiceCategory, ServiceType } from '../lib/types';
import { getServiceCategories, getServiceTypes } from '../lib/api';
import { filterServiceTypesByCategory, generateServiceCodeSuggestion } from '../lib/utils';

interface ServiceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ServiceFormData) => Promise<void>;
  service?: Service | null;
  isLoading?: boolean;
}

export default function ServiceForm({
  isOpen,
  onClose,
  onSubmit,
  service,
  isLoading = false,
}: ServiceFormProps) {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [filteredServiceTypes, setFilteredServiceTypes] = useState<ServiceType[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      serviceCode: '',
      name: '',
      categoryId: '',
      serviceTypeId: '',
      content: '',
      status: 'active',
    },
  });

  const watchedCategoryId = watch('categoryId');
  const watchedName = watch('name');

  // Load categories and service types on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoadingData(true);
      try {
        const [categoriesData, serviceTypesData] = await Promise.all([
          getServiceCategories(),
          getServiceTypes(),
        ]);
        setCategories(categoriesData);
        setServiceTypes(serviceTypesData);
      } catch (error) {
        console.error('Error loading form data:', error);
        toast.error(SERVICE_ERROR_MESSAGES.loadFailed);
      } finally {
        setIsLoadingData(false);
      }
    };

    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  // Filter service types when category changes
  useEffect(() => {
    if (watchedCategoryId) {
      const filtered = filterServiceTypesByCategory(serviceTypes, watchedCategoryId);
      setFilteredServiceTypes(filtered);
      
      // Reset service type selection if current selection doesn't belong to new category
      const currentServiceTypeId = watch('serviceTypeId');
      if (currentServiceTypeId && !filtered.find(st => st.id === currentServiceTypeId)) {
        setValue('serviceTypeId', '' as string);
      }
    } else {
      setFilteredServiceTypes([]);
      setValue('serviceTypeId', '' as string);
    }
  }, [watchedCategoryId, serviceTypes, setValue, watch]);

  // Auto-generate service code suggestion when name or category changes
  useEffect(() => {
    if (watchedName && watchedCategoryId && !service) {
      const selectedCategory = categories.find(c => c.id === watchedCategoryId);
      if (selectedCategory) {
        const suggestion = generateServiceCodeSuggestion(watchedName, selectedCategory);
        setValue('serviceCode', suggestion);
      }
    }
  }, [watchedName, watchedCategoryId, categories, service, setValue]);

  // Reset form when service changes or dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      if (service) {
        // Edit mode
        setValue('serviceCode', service.serviceCode);
        setValue('name', service.name);
        setValue('categoryId', service.categoryId);
        setValue('serviceTypeId', service.serviceTypeId);
        setValue('content', service.content || '');
        setValue('status', service.status);
      } else {
        // Create mode
        reset();
      }
    }
  }, [isOpen, service, setValue, reset]);

  const handleFormSubmit = async (data: ServiceFormData) => {
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      // Error handling is done in parent component
      console.error('Form submit error:', error);
    }
  };

  const handleClose = () => {
    if (!isSubmitting && !isLoading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {service ? SERVICE_FORM_LABELS.update : SERVICE_FORM_LABELS.create}
          </DialogTitle>
          <DialogDescription>
            {service 
              ? 'Cập nhật thông tin dịch vụ. Các trường có dấu * là bắt buộc.'
              : 'Tạo dịch vụ mới. Các trường có dấu * là bắt buộc.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Service Code */}
          <div className="space-y-2">
            <Label htmlFor="serviceCode">
              {SERVICE_FORM_LABELS.serviceCode} *
            </Label>
            <Input
              {...register('serviceCode')}
              id="serviceCode"
              placeholder="VD: KD-DTT-01"
              className={errors.serviceCode ? 'border-red-500' : ''}
              disabled={isLoadingData || isSubmitting || isLoading}
            />
            {errors.serviceCode && (
              <p className="text-sm text-red-600">{errors.serviceCode.message}</p>
            )}
          </div>

          {/* Service Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              {SERVICE_FORM_LABELS.name} *
            </Label>
            <Input
              {...register('name')}
              id="name"
              placeholder="VD: Kiểm định đồng hồ đo điện"
              className={errors.name ? 'border-red-500' : ''}
              disabled={isLoadingData || isSubmitting || isLoading}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Category and Service Type Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="categoryId">
                {SERVICE_FORM_LABELS.category} *
              </Label>
              <Select
                value={watch('categoryId') || undefined}
                onValueChange={(value) => setValue('categoryId', value)}
                disabled={isLoadingData || isSubmitting || isLoading}
              >
                <SelectTrigger className={errors.categoryId ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className="text-sm text-red-600">{errors.categoryId.message}</p>
              )}
            </div>

            {/* Service Type */}
            <div className="space-y-2">
              <Label htmlFor="serviceTypeId">
                {SERVICE_FORM_LABELS.serviceType} *
              </Label>
              <Select
                value={watch('serviceTypeId') || undefined}
                onValueChange={(value) => setValue('serviceTypeId', value)}
                disabled={isLoadingData || isSubmitting || isLoading || !watchedCategoryId}
              >
                <SelectTrigger className={errors.serviceTypeId ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Chọn loại dịch vụ" />
                </SelectTrigger>
                <SelectContent>
                  {filteredServiceTypes.map((serviceType) => (
                    <SelectItem key={serviceType.id} value={serviceType.id}>
                      {serviceType.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.serviceTypeId && (
                <p className="text-sm text-red-600">{errors.serviceTypeId.message}</p>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">
              {SERVICE_FORM_LABELS.status} *
            </Label>
            <Select
              value={watch('status')}
              onValueChange={(value: 'active' | 'inactive') => setValue('status', value)}
              disabled={isLoadingData || isSubmitting || isLoading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-red-600">{errors.status.message}</p>
            )}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">
              {SERVICE_FORM_LABELS.content}
            </Label>
            <Textarea
              {...register('content')}
              id="content"
              placeholder="Mô tả chi tiết về dịch vụ..."
              rows={6}
              className={errors.content ? 'border-red-500' : ''}
              disabled={isLoadingData || isSubmitting || isLoading}
            />
            {errors.content && (
              <p className="text-sm text-red-600">{errors.content.message}</p>
            )}
            <p className="text-sm text-gray-500">
              Hỗ trợ HTML cơ bản. Tối đa 10,000 ký tự.
            </p>
          </div>

          {/* File Upload Section */}
          <div className="space-y-4">
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Tệp đính kèm
              </h4>
              <p className="text-sm text-gray-500 mb-4">
                Hình ảnh: Tối đa 5MB, định dạng JPG/PNG/WebP<br/>
                Video: Tối đa 50MB, định dạng MP4/WebM
              </p>
              
              {/* TODO: Implement file upload components */}
              <div className="text-sm text-gray-400">
                Tính năng upload file sẽ được triển khai trong version tiếp theo
              </div>
            </div>
          </div>
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting || isLoading}
          >
            {SERVICE_FORM_LABELS.cancel}
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit(handleFormSubmit)}
            disabled={isLoadingData || isSubmitting || isLoading}
          >
            {(isSubmitting || isLoading) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {service ? SERVICE_FORM_LABELS.update : SERVICE_FORM_LABELS.submit}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}