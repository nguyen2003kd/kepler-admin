// Helper functions chỉ dùng cho services page - Quản lý dịch vụ
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import type { 
  Service, 
  ServiceCategory, 
  ServiceType, 
  ServiceStatus,
  FileUploadError,
} from './types';
import { 
  SERVICE_STATUSES, 
  FILE_UPLOAD_LIMITS,
  SERVICE_STATUS_COLORS,
} from './constants';

/**
 * Format service status to Vietnamese
 */
export const formatServiceStatus = (status: ServiceStatus): string => {
  return SERVICE_STATUSES[status] || status;
};

/**
 * Get status color class for badge display
 */
export const getServiceStatusColor = (status: ServiceStatus): string => {
  return SERVICE_STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';
};

/**
 * Format date to Vietnamese locale
 */
export const formatServiceDate = (date: Date): string => {
  return format(date, 'dd/MM/yyyy HH:mm', { locale: vi });
};

/**
 * Format date to short format (only date)
 */
export const formatServiceDateShort = (date: Date): string => {
  return format(date, 'dd/MM/yyyy', { locale: vi });
};

/**
 * Generate service display name with category and type
 */
export const generateServiceDisplayName = (
  service: Service,
  includeCode: boolean = false
): string => {
  const category = service.category?.name || 'N/A';
  const serviceType = service.serviceType?.name || 'N/A';
  const name = service.name;
  
  if (includeCode) {
    return `[${service.serviceCode}] ${name} - ${category} / ${serviceType}`;
  }
  
  return `${name} - ${category} / ${serviceType}`;
};

/**
 * Validate image file before upload
 */
export const validateImageFile = (file: File): FileUploadError | null => {
  // Check file size
  if (file.size > FILE_UPLOAD_LIMITS.imageMaxSize) {
    return {
      file: file.name,
      message: `Kích thước file vượt quá ${FILE_UPLOAD_LIMITS.imageMaxSize / (1024 * 1024)}MB`,
    };
  }
  
  // Check file type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!FILE_UPLOAD_LIMITS.acceptedImageTypes.includes(file.type as any)) {
    return {
      file: file.name,
      message: `Loại file không được hỗ trợ. Chỉ chấp nhận: ${FILE_UPLOAD_LIMITS.imageExtensions.join(', ')}`,
    };
  }
  
  return null;
};

/**
 * Validate video file before upload
 */
export const validateVideoFile = (file: File): FileUploadError | null => {
  // Check file size
  if (file.size > FILE_UPLOAD_LIMITS.videoMaxSize) {
    return {
      file: file.name,
      message: `Kích thước file vượt quá ${FILE_UPLOAD_LIMITS.videoMaxSize / (1024 * 1024)}MB`,
    };
  }
  
  // Check file type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!FILE_UPLOAD_LIMITS.acceptedVideoTypes.includes(file.type as any)) {
    return {
      file: file.name,
      message: `Loại file không được hỗ trợ. Chỉ chấp nhận: ${FILE_UPLOAD_LIMITS.videoExtensions.join(', ')}`,
    };
  }
  
  return null;
};

/**
 * Validate multiple files
 */
export const validateFiles = (
  files: File[], 
  type: 'image' | 'video'
): FileUploadError[] => {
  const errors: FileUploadError[] = [];
  const maxFiles = type === 'image' 
    ? FILE_UPLOAD_LIMITS.maxImageFiles 
    : FILE_UPLOAD_LIMITS.maxVideoFiles;
    
  // Check number of files
  if (files.length > maxFiles) {
    errors.push({
      file: 'all',
      message: `Không được upload quá ${maxFiles} file ${type === 'image' ? 'hình ảnh' : 'video'}`,
    });
  }
  
  // Validate each file
  files.forEach((file) => {
    const error = type === 'image' 
      ? validateImageFile(file) 
      : validateVideoFile(file);
    if (error) {
      errors.push(error);
    }
  });
  
  return errors;
};

/**
 * Format file size to human readable string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Get file extension from filename
 */
export const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

/**
 * Filter service types by category
 */
export const filterServiceTypesByCategory = (
  serviceTypes: ServiceType[],
  categoryId: string
): ServiceType[] => {
  return serviceTypes.filter(type => type.categoryId === categoryId);
};

/**
 * Search services by multiple criteria
 */
export const searchServices = (
  services: Service[],
  searchQuery: string
): Service[] => {
  if (!searchQuery.trim()) return services;
  
  const query = searchQuery.toLowerCase().trim();
  
  return services.filter(service => {
    return (
      service.name.toLowerCase().includes(query) ||
      service.serviceCode.toLowerCase().includes(query) ||
      service.category?.name.toLowerCase().includes(query) ||
      service.serviceType?.name.toLowerCase().includes(query)
    );
  });
};

/**
 * Sort services by field and direction
 */
export const sortServices = (
  services: Service[],
  field: string,
  direction: 'asc' | 'desc'
): Service[] => {
  return [...services].sort((a, b) => {
    let aValue: string | Date;
    let bValue: string | Date;
    
    switch (field) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'serviceCode':
        aValue = a.serviceCode.toLowerCase();
        bValue = b.serviceCode.toLowerCase();
        break;
      case 'createdAt':
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      default:
        return 0;
    }
    
    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Generate service code suggestion based on name and category
 */
export const generateServiceCodeSuggestion = (
  name: string,
  category?: ServiceCategory
): string => {
  // Take first 2 characters from category name
  const categoryPrefix = category?.name.substring(0, 2).toUpperCase() || 'SV';
  
  // Take first letters of each word in service name
  const nameWords = name
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0)
    .slice(0, 3); // Max 3 words
    
  const namePart = nameWords
    .map(word => word.charAt(0).toUpperCase())
    .join('');
    
  // Add random number for uniqueness
  const randomPart = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  
  return `${categoryPrefix}-${namePart}-${randomPart}`;
};

/**
 * Check if service can be deleted (business rule check)
 */
export const canDeleteService = (service: Service): boolean => {
  // TODO: Implement business logic to check if service is used elsewhere
  // For now, allow deletion of inactive services only in development
  return service.status === 'inactive';
};

/**
 * Get service statistics summary
 */
export const getServiceStatistics = (services: Service[]) => {
  const stats = {
    total: services.length,
    active: 0,
    inactive: 0,
    recentlyAdded: 0,
    categories: new Set<string>(),
    serviceTypes: new Set<string>(),
  };
  
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  services.forEach(service => {
    // Status counts
    if (service.status === 'active') stats.active++;
    else stats.inactive++;
    
    // Recently added (last 7 days)
    if (service.createdAt >= sevenDaysAgo) {
      stats.recentlyAdded++;
    }
    
    // Categories and service types
    if (service.categoryId) stats.categories.add(service.categoryId);
    if (service.serviceTypeId) stats.serviceTypes.add(service.serviceTypeId);
  });
  
  return {
    totalServices: stats.total,
    activeServices: stats.active,
    inactiveServices: stats.inactive,
    recentlyAdded: stats.recentlyAdded,
    totalCategories: stats.categories.size,
    totalServiceTypes: stats.serviceTypes.size,
  };
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

/**
 * Remove HTML tags from content for preview
 */
export const stripHtmlTags = (html: string): string => {
  // Simple regex to remove HTML tags - use a proper library in production
  return html.replace(/<[^>]*>/g, '').trim();
};

/**
 * Get preview text from service content
 */
export const getServiceContentPreview = (content?: string): string => {
  if (!content) return 'Chưa có mô tả';
  
  const plainText = stripHtmlTags(content);
  return truncateText(plainText, 150);
};