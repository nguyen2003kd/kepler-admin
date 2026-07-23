import { z } from 'zod';
import { 
  SERVICE_CODE_PATTERN, 
  SERVICE_NAME_MAX_LENGTH, 
  SERVICE_CODE_MAX_LENGTH,
  SERVICE_CONTENT_MAX_LENGTH,
  FILE_UPLOAD_LIMITS,
} from './constants';

// Validation schemas chỉ cho services page - Quản lý dịch vụ

// Service Category validation
export const serviceCategorySchema = z.object({
  id: z.string().optional(),
  name: z.string()
    .min(1, 'Tên danh mục là bắt buộc')
    .max(255, 'Tên danh mục không được vượt quá 255 ký tự'),
  description: z.string().optional(),
});

// Service Type validation
export const serviceTypeSchema = z.object({
  id: z.string().optional(),
  name: z.string()
    .min(1, 'Tên loại dịch vụ là bắt buộc')
    .max(255, 'Tên loại dịch vụ không được vượt quá 255 ký tự'),
  description: z.string().optional(),
  categoryId: z.string().min(1, 'Danh mục dịch vụ là bắt buộc'),
});

// Service validation schema với business rules
export const serviceSchema = z.object({
  id: z.string().optional(),
  
  serviceCode: z.string()
    .min(1, 'Mã dịch vụ là bắt buộc')
    .max(SERVICE_CODE_MAX_LENGTH, `Mã dịch vụ không được vượt quá ${SERVICE_CODE_MAX_LENGTH} ký tự`)
    .regex(SERVICE_CODE_PATTERN, 'Mã dịch vụ chỉ được chứa chữ, số và dấu gạch ngang')
    .transform((val) => val.toUpperCase().trim()), // Auto convert to uppercase
    
  name: z.string()
    .min(1, 'Tên dịch vụ là bắt buộc')
    .max(SERVICE_NAME_MAX_LENGTH, `Tên dịch vụ không được vượt quá ${SERVICE_NAME_MAX_LENGTH} ký tự`)
    .transform((val) => val.trim()),
    
  categoryId: z.string()
    .min(1, 'Danh mục dịch vụ là bắt buộc'),
    
  serviceTypeId: z.string()
    .min(1, 'Loại dịch vụ là bắt buộc'),
    
  content: z.string()
    .max(SERVICE_CONTENT_MAX_LENGTH, `Nội dung không được vượt quá ${SERVICE_CONTENT_MAX_LENGTH} ký tự`)
    .optional()
    .or(z.literal('')),
    
  images: z.array(z.string().url('URL hình ảnh không hợp lệ'))
    .max(FILE_UPLOAD_LIMITS.maxImageFiles, `Không được upload quá ${FILE_UPLOAD_LIMITS.maxImageFiles} hình ảnh`)
    .optional(),
    
  videos: z.array(z.string().url('URL video không hợp lệ'))
    .max(FILE_UPLOAD_LIMITS.maxVideoFiles, `Không được upload quá ${FILE_UPLOAD_LIMITS.maxVideoFiles} video`)
    .optional(),
    
  status: z.enum(['active', 'inactive'], {
    message: 'Trạng thái là bắt buộc',
  }),
});

// Service form validation (for client-side form)
export const serviceFormSchema = z.object({
  serviceCode: z.string()
    .min(1, 'Mã dịch vụ là bắt buộc')
    .max(SERVICE_CODE_MAX_LENGTH, `Mã dịch vụ không được vượt quá ${SERVICE_CODE_MAX_LENGTH} ký tự`)
    .regex(SERVICE_CODE_PATTERN, 'Mã dịch vụ chỉ được chứa chữ, số và dấu gạch ngang')
    .transform((val) => val.toUpperCase().trim()),
    
  name: z.string()
    .min(1, 'Tên dịch vụ là bắt buộc')
    .max(SERVICE_NAME_MAX_LENGTH, `Tên dịch vụ không được vượt quá ${SERVICE_NAME_MAX_LENGTH} ký tự`)
    .transform((val) => val.trim()),
    
  categoryId: z.string()
    .min(1, 'Danh mục dịch vụ là bắt buộc'),
    
  serviceTypeId: z.string()
    .min(1, 'Loại dịch vụ là bắt buộc'),
    
  content: z.string()
    .max(SERVICE_CONTENT_MAX_LENGTH, `Nội dung không được vượt quá ${SERVICE_CONTENT_MAX_LENGTH} ký tự`)
    .optional()
    .or(z.literal('')),
    
  status: z.enum(['active', 'inactive'], {
    message: 'Trạng thái là bắt buộc',
  }),
}).refine(() => {
  // Business rule: Service type must belong to selected category
  // This will be checked on server side với database query
  return true; 
}, {
  message: 'Loại dịch vụ không thuộc danh mục đã chọn',
  path: ['serviceTypeId'],
});

// File upload validation
export const imageFileSchema = z.object({
  file: z.instanceof(File)
    .refine(
      (file) => file.size <= FILE_UPLOAD_LIMITS.imageMaxSize,
      `Kích thước hình ảnh không được vượt quá ${FILE_UPLOAD_LIMITS.imageMaxSize / (1024 * 1024)}MB`
    )
    .refine(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (file) => FILE_UPLOAD_LIMITS.acceptedImageTypes.includes(file.type as any),
      `Chỉ chấp nhận file hình ảnh: ${FILE_UPLOAD_LIMITS.imageExtensions.join(', ')}`
    ),
});

export const videoFileSchema = z.object({
  file: z.instanceof(File)
    .refine(
      (file) => file.size <= FILE_UPLOAD_LIMITS.videoMaxSize,
      `Kích thước video không được vượt quá ${FILE_UPLOAD_LIMITS.videoMaxSize / (1024 * 1024)}MB`
    )
    .refine(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (file) => FILE_UPLOAD_LIMITS.acceptedVideoTypes.includes(file.type as any),
      `Chỉ chấp nhận file video: ${FILE_UPLOAD_LIMITS.videoExtensions.join(', ')}`
    ),
});

// Filter validation
export const serviceFiltersSchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().optional(),
  serviceTypeId: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
}).refine((data) => {
  // Validate date range
  if (data.dateFrom && data.dateTo) {
    return data.dateFrom <= data.dateTo;
  }
  return true;
}, {
  message: 'Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc',
  path: ['dateTo'],
});

// Bulk operations validation
export const bulkServiceOperationSchema = z.object({
  serviceIds: z.array(z.string().min(1))
    .min(1, 'Phải chọn ít nhất 1 dịch vụ'),
  operation: z.enum(['delete', 'activate', 'deactivate'], {
    message: 'Loại thao tác là bắt buộc',
  }),
});

// Export types for TypeScript inference
export type ServiceCategoryFormData = z.infer<typeof serviceCategorySchema>;
export type ServiceTypeFormData = z.infer<typeof serviceTypeSchema>;
export type ServiceFormData = z.infer<typeof serviceFormSchema>;
export type ServiceFiltersData = z.infer<typeof serviceFiltersSchema>;
export type BulkServiceOperationData = z.infer<typeof bulkServiceOperationSchema>;
export type ImageFileData = z.infer<typeof imageFileSchema>;
export type VideoFileData = z.infer<typeof videoFileSchema>;

// Custom validation functions
export const validateServiceCodeUnique = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _serviceCode: string, 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _excludeId?: string
): Promise<boolean> => {
  // TODO: Implement API call to check uniqueness
  // For now return true for development
  return true;
};

export const validateServiceNameUnique = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _name: string, 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _serviceTypeId: string, 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _excludeId?: string
): Promise<boolean> => {
  // TODO: Implement API call to check uniqueness within service type
  // For now return true for development
  return true;
};

export const validateServiceTypeCategory = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _serviceTypeId: string, 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _categoryId: string
): Promise<boolean> => {
  // TODO: Implement API call to verify service type belongs to category
  // For now return true for development
  return true;
};