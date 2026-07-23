// Re-export all centralized types
export * from './post-approval'
export * from './quotation'
export * from './organizational-chart'
export * from './media-file'
export * from './news-form'
export * from './customers'
export * from './work-schedule'

// Contact Type
export interface Contact {
  id: string
  name: string
  email: string
  phone_number?: string
  content?: string
  created_at?: string
}

// Common Types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  status?: number;
  message: string;
  data?: unknown;
}

// Order Types
export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  status: OrderStatus;
  totalAmount: number;
  currency: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 
  | 'pending' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  category: string;
  price: number;
  costPrice: number;
  stock: number;
  images: string[];
  status: ProductStatus;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type ProductStatus = 'active' | 'inactive' | 'out_of_stock';

export interface ProductFormData {
  name: string;
  description: string;
  sku: string;
  category: string;
  price: number;
  costPrice: number;
  stock: number;
  status: ProductStatus;
  tags: string[];
}

// Customer Types
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  totalOrders: number;
  totalSpent: number;
  status: CustomerStatus;
  address?: Address;
  createdAt: string;
  updatedAt: string;
}

export type CustomerStatus = 'active' | 'inactive' | 'blocked';

// Dashboard Analytics Types
export interface DashboardStats {
  totalRevenue: number;
  revenueChange: number;
  totalOrders: number;
  ordersChange: number;
  totalCustomers: number;
  customersChange: number;
  averageOrderValue: number;
  averageOrderValueChange: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
}

// User/Auth Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
}

export type UserRole = 'admin' | 'manager' | 'staff';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Table Types
export interface TableState {
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
  sorting: {
    id: string;
    desc: boolean;
  }[];
  columnFilters: {
    id: string;
    value: unknown;
  }[];
  globalFilter: string;
}
