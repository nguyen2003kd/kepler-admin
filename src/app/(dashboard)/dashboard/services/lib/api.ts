// API functions chỉ dùng cho services page - Quản lý dịch vụ
import type { 
  Service,
  ServiceCategory,
  ServiceType,
  CreateServiceData,
  UpdateServiceData,
  ServiceFilters,
  ServiceSortBy,
  ServiceStats,
  FileUploadResult,
} from './types';
import { 
  MOCK_SERVICE_CATEGORIES, 
  MOCK_SERVICE_TYPES,
} from './constants';

// Mock data for development - sẽ thay thế bằng real API calls
let mockServices: Service[] = [
  {
    id: 'srv-1',
    serviceCode: 'KD-DTT-01',
    name: 'Kiểm định đồng hồ đo điện',
    categoryId: 'cat-1',
    serviceTypeId: 'type-1',
    content: `
      <h3>Dịch vụ kiểm định đồng hồ đo điện</h3>
      <p>Chúng tôi cung cấp dịch vụ kiểm định đồng hồ đo điện đảm bảo độ chính xác theo tiêu chuẩn quốc gia.</p>
      <h4>Quy trình kiểm định:</h4>
      <ul>
        <li>Kiểm tra ngoại quan thiết bị</li>
        <li>Đo kiểm các thông số kỹ thuật</li>
        <li>So sánh với chuẩn quốc gia</li>
        <li>Cấp giấy chứng nhận kiểm định</li>
      </ul>
    `,
    images: [
      '/images/services/electrical-meter-1.jpg',
      '/images/services/electrical-meter-2.jpg',
    ],
    videos: [
      '/videos/services/electrical-meter-inspection.mp4',
    ],
    status: 'active',
    createdAt: new Date('2024-01-15T10:30:00'),
    updatedAt: new Date('2024-01-20T14:15:00'),
  },
  {
    id: 'srv-2',
    serviceCode: 'KD-CK-01',
    name: 'Kiểm định cân điện tử',
    categoryId: 'cat-1',
    serviceTypeId: 'type-2',
    content: `
      <h3>Dịch vụ kiểm định cân điện tử</h3>
      <p>Kiểm định cân điện tử với độ chính xác cao, đáp ứng yêu cầu của các ngành công nghiệp.</p>
    `,
    images: [
      '/images/services/electronic-scale-1.jpg',
    ],
    status: 'active',
    createdAt: new Date('2024-01-18T09:45:00'),
    updatedAt: new Date('2024-01-18T09:45:00'),
  },
  {
    id: 'srv-3',
    serviceCode: 'TN-VL-01',
    name: 'Thử nghiệm độ bền kim loại',
    categoryId: 'cat-2',
    serviceTypeId: 'type-3',
    content: `
      <h3>Thử nghiệm độ bền kim loại</h3>
      <p>Thực hiện các thử nghiệm đánh giá tính chất cơ học của vật liệu kim loại.</p>
    `,
    images: [],
    videos: [],
    status: 'active',
    createdAt: new Date('2024-01-20T11:20:00'),
    updatedAt: new Date('2024-01-25T16:30:00'),
  },
  {
    id: 'srv-4',
    serviceCode: 'TN-MT-01',
    name: 'Thử nghiệm tác động môi trường',
    categoryId: 'cat-2',
    serviceTypeId: 'type-4',
    content: `
      <h3>Thử nghiệm tác động môi trường</h3>
      <p>Đánh giá tác động của các yếu tố môi trường lên sản phẩm và thiết bị.</p>
    `,
    status: 'inactive',
    createdAt: new Date('2024-01-10T08:15:00'),
    updatedAt: new Date('2024-01-10T08:15:00'),
  },
  {
    id: 'srv-5',
    serviceCode: 'CN-ISO-01',
    name: 'Chứng nhận ISO 9001',
    categoryId: 'cat-3',
    serviceTypeId: 'type-5',
    content: `
      <h3>Chứng nhận hệ thống quản lý chất lượng ISO 9001</h3>
      <p>Hỗ trợ doanh nghiệp xây dựng và chứng nhận hệ thống quản lý chất lượng theo tiêu chuẩn ISO 9001.</p>
    `,
    status: 'active',
    createdAt: new Date('2024-02-01T13:45:00'),
    updatedAt: new Date('2024-02-01T13:45:00'),
  },
];

// Enrich mock data with category and serviceType references
mockServices = mockServices.map(service => ({
  ...service,
  category: [...MOCK_SERVICE_CATEGORIES].find(cat => cat.id === service.categoryId),
  serviceType: [...MOCK_SERVICE_TYPES].find(type => type.id === service.serviceTypeId),
}));

/**
 * Get all service categories
 */
export async function getServiceCategories(): Promise<ServiceCategory[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  return [...MOCK_SERVICE_CATEGORIES];
}

/**
 * Get service types by category
 */
export async function getServiceTypes(categoryId?: string): Promise<ServiceType[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  if (categoryId) {
    return [...MOCK_SERVICE_TYPES].filter(type => type.categoryId === categoryId);
  }
  
  return [...MOCK_SERVICE_TYPES];
}

/**
 * Get services with filtering, sorting and pagination
 */
export async function getServices(
  filters?: ServiceFilters,
  sort?: ServiceSortBy,
  page: number = 1,
  limit: number = 20
): Promise<{
  services: Service[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let filteredServices = [...mockServices];
  
  // Apply filters
  if (filters) {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredServices = filteredServices.filter(service =>
        service.name.toLowerCase().includes(searchLower) ||
        service.serviceCode.toLowerCase().includes(searchLower) ||
        service.category?.name.toLowerCase().includes(searchLower) ||
        service.serviceType?.name.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters.categoryId) {
      filteredServices = filteredServices.filter(service =>
        service.categoryId === filters.categoryId
      );
    }
    
    if (filters.serviceTypeId) {
      filteredServices = filteredServices.filter(service =>
        service.serviceTypeId === filters.serviceTypeId
      );
    }
    
    if (filters.status) {
      filteredServices = filteredServices.filter(service =>
        service.status === filters.status
      );
    }
    
    if (filters.dateFrom) {
      filteredServices = filteredServices.filter(service =>
        service.createdAt >= filters.dateFrom!
      );
    }
    
    if (filters.dateTo) {
      filteredServices = filteredServices.filter(service =>
        service.createdAt <= filters.dateTo!
      );
    }
  }
  
  // Apply sorting
  if (sort) {
    filteredServices.sort((a, b) => {
      let aValue: string | Date;
      let bValue: string | Date;
      
      switch (sort.field) {
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
      
      if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }
  
  const total = filteredServices.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedServices = filteredServices.slice(startIndex, endIndex);
  
  return {
    services: paginatedServices,
    total,
    page,
    limit,
    totalPages,
  };
}

/**
 * Get single service by ID
 */
export async function getService(id: string): Promise<Service | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const service = mockServices.find(s => s.id === id);
  return service || null;
}

/**
 * Create new service
 */
export async function createService(data: CreateServiceData): Promise<Service> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Check for duplicate service code
  const existingCode = mockServices.find(s => s.serviceCode === data.serviceCode);
  if (existingCode) {
    throw new Error('Mã dịch vụ đã tồn tại');
  }
  
  // Check for duplicate name in same service type
  const existingName = mockServices.find(s => 
    s.name === data.name && s.serviceTypeId === data.serviceTypeId
  );
  if (existingName) {
    throw new Error('Tên dịch vụ đã tồn tại trong loại dịch vụ này');
  }
  
  const newService: Service = {
    id: `srv-${Date.now()}`,
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: [...MOCK_SERVICE_CATEGORIES].find(cat => cat.id === data.categoryId),
    serviceType: [...MOCK_SERVICE_TYPES].find(type => type.id === data.serviceTypeId),
  };
  
  mockServices.push(newService);
  return newService;
}

/**
 * Update existing service
 */
export async function updateService(data: UpdateServiceData): Promise<Service> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = mockServices.findIndex(s => s.id === data.id);
  if (index === -1) {
    throw new Error('Dịch vụ không tồn tại');
  }
  
  // Check for duplicate service code (exclude current service)
  const existingCode = mockServices.find(s => 
    s.serviceCode === data.serviceCode && s.id !== data.id
  );
  if (existingCode) {
    throw new Error('Mã dịch vụ đã tồn tại');
  }
  
  // Check for duplicate name in same service type (exclude current service)
  const existingName = mockServices.find(s => 
    s.name === data.name && 
    s.serviceTypeId === data.serviceTypeId && 
    s.id !== data.id
  );
  if (existingName) {
    throw new Error('Tên dịch vụ đã tồn tại trong loại dịch vụ này');
  }
  
  const updatedService: Service = {
    ...mockServices[index],
    ...data,
    updatedAt: new Date(),
    category: [...MOCK_SERVICE_CATEGORIES].find(cat => cat.id === data.categoryId),
    serviceType: [...MOCK_SERVICE_TYPES].find(type => type.id === data.serviceTypeId),
  };
  
  mockServices[index] = updatedService;
  return updatedService;
}

/**
 * Delete service
 */
export async function deleteService(id: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = mockServices.findIndex(s => s.id === id);
  if (index === -1) {
    throw new Error('Dịch vụ không tồn tại');
  }
  
  // Business rule: Only allow deleting inactive services
  if (mockServices[index].status === 'active') {
    throw new Error('Không thể xóa dịch vụ đang hoạt động. Vui lòng ngừng hoạt động trước khi xóa.');
  }
  
  mockServices.splice(index, 1);
  return true;
}

/**
 * Update service status
 */
export async function updateServiceStatus(
  id: string, 
  status: 'active' | 'inactive'
): Promise<Service> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = mockServices.findIndex(s => s.id === id);
  if (index === -1) {
    throw new Error('Dịch vụ không tồn tại');
  }
  
  mockServices[index] = {
    ...mockServices[index],
    status,
    updatedAt: new Date(),
  };
  
  return mockServices[index];
}

/**
 * Bulk update service status
 */
export async function bulkUpdateServiceStatus(
  serviceIds: string[],
  status: 'active' | 'inactive'
): Promise<Service[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const updatedServices: Service[] = [];
  
  for (const id of serviceIds) {
    const index = mockServices.findIndex(s => s.id === id);
    if (index !== -1) {
      mockServices[index] = {
        ...mockServices[index],
        status,
        updatedAt: new Date(),
      };
      updatedServices.push(mockServices[index]);
    }
  }
  
  return updatedServices;
}

/**
 * Bulk delete services
 */
export async function bulkDeleteServices(serviceIds: string[]): Promise<number> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let deletedCount = 0;
  
  for (const id of serviceIds) {
    const index = mockServices.findIndex(s => s.id === id);
    if (index !== -1) {
      // Only delete inactive services
      if (mockServices[index].status === 'inactive') {
        mockServices.splice(index, 1);
        deletedCount++;
      }
    }
  }
  
  return deletedCount;
}

/**
 * Get service statistics
 */
export async function getServiceStatistics(): Promise<ServiceStats> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const stats = {
    totalServices: mockServices.length,
    activeServices: mockServices.filter(s => s.status === 'active').length,
    inactiveServices: mockServices.filter(s => s.status === 'inactive').length,
    totalCategories: MOCK_SERVICE_CATEGORIES.length,
    totalServiceTypes: MOCK_SERVICE_TYPES.length,
    recentlyAdded: 0,
  };
  
  // Count recently added (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  stats.recentlyAdded = mockServices.filter(s => s.createdAt >= sevenDaysAgo).length;
  
  return stats;
}

/**
 * Upload file (mock implementation)
 */
export async function uploadFile(
  file: File,
  type: 'image' | 'video'
): Promise<FileUploadResult> {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate upload delay
  
  // Mock upload result
  const result: FileUploadResult = {
    url: `/uploads/${type}s/${Date.now()}-${file.name}`,
    filename: file.name,
    size: file.size,
    type: file.type,
  };
  
  return result;
}

/**
 * Upload multiple files
 */
export async function uploadMultipleFiles(
  files: File[],
  type: 'image' | 'video'
): Promise<FileUploadResult[]> {
  const uploadPromises = files.map(file => uploadFile(file, type));
  return Promise.all(uploadPromises);
}

/**
 * Check if service code is unique
 */
export async function checkServiceCodeUnique(
  serviceCode: string,
  excludeId?: string
): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const existing = mockServices.find(s => 
    s.serviceCode === serviceCode && s.id !== excludeId
  );
  
  return !existing;
}

/**
 * Check if service name is unique in service type
 */
export async function checkServiceNameUnique(
  name: string,
  serviceTypeId: string,
  excludeId?: string
): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const existing = mockServices.find(s => 
    s.name === name && 
    s.serviceTypeId === serviceTypeId && 
    s.id !== excludeId
  );
  
  return !existing;
}