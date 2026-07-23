// Constants chỉ dùng trong services page - Quản lý dịch vụ
import type { ServiceStatus, ServiceSortBy } from './types';

export const SERVICE_STATUSES: Record<ServiceStatus, string> = {
  active: 'Hoạt động',
  inactive: 'Ngừng hoạt động',
} as const;

export const SERVICE_STATUS_COLORS: Record<ServiceStatus, string> = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
} as const;

export const SERVICE_FORM_LABELS = {
  serviceCode: 'Mã dịch vụ',
  name: 'Tên dịch vụ',
  category: 'Danh mục dịch vụ',
  serviceType: 'Loại dịch vụ',
  content: 'Nội dung mô tả',
  images: 'Hình ảnh dịch vụ',
  videos: 'Video dịch vụ',
  status: 'Trạng thái',
  createdAt: 'Ngày tạo',
  updatedAt: 'Ngày cập nhật',
  submit: 'Lưu dịch vụ',
  cancel: 'Hủy bỏ',
  edit: 'Chỉnh sửa',
  delete: 'Xóa',
  create: 'Tạo dịch vụ mới',
  update: 'Cập nhật dịch vụ',
} as const;

export const SERVICE_ERROR_MESSAGES = {
  serviceCodeRequired: 'Mã dịch vụ là bắt buộc',
  serviceCodeDuplicate: 'Mã dịch vụ đã tồn tại',
  serviceCodeInvalid: 'Mã dịch vụ chỉ được chứa chữ, số và dấu gạch ngang',
  nameRequired: 'Tên dịch vụ là bắt buộc',
  nameDuplicate: 'Tên dịch vụ đã tồn tại trong loại dịch vụ này',
  categoryRequired: 'Danh mục dịch vụ là bắt buộc',
  serviceTypeRequired: 'Loại dịch vụ là bắt buộc',
  contentInvalid: 'Nội dung mô tả không hợp lệ',
  fileTooBig: 'Kích thước file vượt quá giới hạn cho phép',
  fileTypeInvalid: 'Loại file không được hỗ trợ',
  uploadFailed: 'Upload file thất bại',
  loadFailed: 'Tải danh sách dịch vụ thất bại',
  createFailed: 'Tạo dịch vụ thất bại',
  updateFailed: 'Cập nhật dịch vụ thất bại',
  deleteFailed: 'Xóa dịch vụ thất bại',
} as const;

export const SERVICE_SUCCESS_MESSAGES = {
  created: 'Tạo dịch vụ thành công',
  updated: 'Cập nhật dịch vụ thành công',
  deleted: 'Xóa dịch vụ thành công',
  statusChanged: 'Thay đổi trạng thái thành công',
  bulkDeleted: 'Xóa nhiều dịch vụ thành công',
  bulkStatusChanged: 'Thay đổi trạng thái nhiều dịch vụ thành công',
} as const;

export const FILE_UPLOAD_LIMITS = {
  imageMaxSize: 5 * 1024 * 1024, // 5MB
  videoMaxSize: 50 * 1024 * 1024, // 50MB
  maxImageFiles: 10,
  maxVideoFiles: 3,
  acceptedImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  acceptedVideoTypes: ['video/mp4', 'video/webm', 'video/ogg'],
  imageExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
  videoExtensions: ['.mp4', '.webm', '.ogg'],
} as const;

export const SERVICE_TABLE_COLUMNS = [
  {
    key: 'serviceCode',
    label: 'Mã dịch vụ',
    sortable: true,
    width: '120px',
  },
  {
    key: 'name',
    label: 'Tên dịch vụ',
    sortable: true,
    width: '200px',
  },
  {
    key: 'category',
    label: 'Danh mục',
    sortable: false,
    width: '150px',
  },
  {
    key: 'serviceType',
    label: 'Loại dịch vụ',
    sortable: false,
    width: '150px',
  },
  {
    key: 'status',
    label: 'Trạng thái',
    sortable: false,
    width: '120px',
  },
  {
    key: 'createdAt',
    label: 'Ngày tạo',
    sortable: true,
    width: '120px',
  },
  {
    key: 'actions',
    label: 'Thao tác',
    sortable: false,
    width: '120px',
  },
] as const;

export const SERVICE_SORT_OPTIONS: ServiceSortBy[] = [
  { field: 'createdAt', direction: 'desc' },
  { field: 'createdAt', direction: 'asc' },
  { field: 'name', direction: 'asc' },
  { field: 'name', direction: 'desc' },
  { field: 'serviceCode', direction: 'asc' },
  { field: 'serviceCode', direction: 'desc' },
] as const;

export const SERVICE_SORT_LABELS: Record<string, string> = {
  'createdAt-desc': 'Mới nhất',
  'createdAt-asc': 'Cũ nhất',
  'name-asc': 'Tên A-Z',
  'name-desc': 'Tên Z-A',
  'serviceCode-asc': 'Mã A-Z',
  'serviceCode-desc': 'Mã Z-A',
} as const;

export const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50, 100] as const;
export const DEFAULT_PAGE_SIZE = 20;

export const SERVICE_SEARCH_PLACEHOLDER = 'Tìm kiếm theo tên hoặc mã dịch vụ...';

export const SERVICE_CONTENT_MAX_LENGTH = 10000; // characters
export const SERVICE_NAME_MAX_LENGTH = 255;
export const SERVICE_CODE_MAX_LENGTH = 50;

// Regex patterns
export const SERVICE_CODE_PATTERN = /^[a-zA-Z0-9-_]+$/; // Chỉ cho phép chữ, số, gạch ngang, gạch dưới

// Sample categories and service types cho development
export const MOCK_SERVICE_CATEGORIES = [
  {
    id: 'cat-1',
    name: 'Kiểm định',
    description: 'Các dịch vụ kiểm định chất lượng sản phẩm',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'cat-2', 
    name: 'Thử nghiệm',
    description: 'Các dịch vụ thử nghiệm và đánh giá sản phẩm',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'cat-3',
    name: 'Chứng nhận',
    description: 'Các dịch vụ cấp chứng nhận chất lượng',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'cat-4',
    name: 'Đào tạo',
    description: 'Các khóa đào tạo về kiểm định chất lượng',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
] as const;

export const MOCK_SERVICE_TYPES = [
  // Kiểm định
  {
    id: 'type-1',
    name: 'Kiểm định điện tử',
    description: 'Kiểm định thiết bị điện tử',
    categoryId: 'cat-1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'type-2',
    name: 'Kiểm định cơ khí',
    description: 'Kiểm định thiết bị cơ khí',
    categoryId: 'cat-1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  // Thử nghiệm
  {
    id: 'type-3',
    name: 'Thử nghiệm vật liệu',
    description: 'Thử nghiệm tính chất vật liệu',
    categoryId: 'cat-2',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'type-4',
    name: 'Thử nghiệm môi trường',
    description: 'Thử nghiệm tác động môi trường',
    categoryId: 'cat-2',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  // Chứng nhận
  {
    id: 'type-5',
    name: 'Chứng nhận ISO',
    description: 'Cấp chứng nhận ISO',
    categoryId: 'cat-3',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'type-6',
    name: 'Chứng nhận CE',
    description: 'Cấp chứng nhận CE',
    categoryId: 'cat-3',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  // Đào tạo
  {
    id: 'type-7',
    name: 'Đào tạo cơ bản',
    description: 'Khóa đào tạo cơ bản',
    categoryId: 'cat-4',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'type-8',
    name: 'Đào tạo nâng cao',
    description: 'Khóa đào tạo nâng cao',
    categoryId: 'cat-4',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
] as const;