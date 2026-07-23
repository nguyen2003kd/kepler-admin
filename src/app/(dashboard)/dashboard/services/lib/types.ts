// Types chỉ dùng trong services page - Quản lý dịch vụ
export interface ServiceCategory {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceType {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
  category?: ServiceCategory;
  createdAt: Date;
  updatedAt: Date;
}

export interface Service {
  id: string;
  serviceCode: string; // Mã dịch vụ - unique
  name: string; // Tên dịch vụ - unique trong cùng serviceType
  categoryId: string;
  serviceTypeId: string;
  category?: ServiceCategory;
  serviceType?: ServiceType;
  content?: string; // Nội dung văn bản/HTML
  images?: string[]; // URLs của hình ảnh
  videos?: string[]; // URLs của video
  status: ServiceStatus;
  createdAt: Date; // Ngày tạo dịch vụ - auto-generated
  updatedAt: Date;
}

export type ServiceStatus = 'active' | 'inactive';

export interface ServiceFormData {
  serviceCode: string;
  name: string;
  categoryId: string;
  serviceTypeId: string;
  content?: string;
  images?: FileList | string[];
  videos?: FileList | string[];
  status: ServiceStatus;
}

export interface CreateServiceData {
  serviceCode: string;
  name: string;
  categoryId: string;
  serviceTypeId: string;
  content?: string;
  images?: string[];
  videos?: string[];
  status: ServiceStatus;
}

export interface UpdateServiceData extends CreateServiceData {
  id: string;
}

export interface ServiceFilters {
  search?: string; // Search by name, code
  categoryId?: string;
  serviceTypeId?: string;
  status?: ServiceStatus;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface ServiceSortBy {
  field: 'name' | 'serviceCode' | 'createdAt' | 'status';
  direction: 'asc' | 'desc';
}

export interface ServiceState {
  isLoading: boolean;
  error: string | null;
  selectedService: Service | null;
  isFormOpen: boolean;
  isDeleteDialogOpen: boolean;
}

export interface FileUploadResult {
  url: string;
  filename: string;
  size: number;
  type: string;
}

export interface FileUploadError {
  file: string;
  message: string;
}

export interface BulkServiceOperation {
  serviceIds: string[];
  operation: 'delete' | 'activate' | 'deactivate';
}

export interface ServiceStats {
  totalServices: number;
  activeServices: number;
  inactiveServices: number;
  totalCategories: number;
  totalServiceTypes: number;
  recentlyAdded: number; // Services added in last 7 days
}