'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/shared/data-table';
import { productColumns } from '@/components/features/products/product-columns';
import { Product } from '@/types';
import { Plus, Download, Package, AlertTriangle, TrendingUp } from 'lucide-react';
import { Header } from '@/components/layout/header';

// Mock data - replace with actual API call
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    description: 'Premium wireless headphones with noise cancellation',
    sku: 'WH-001',
    category: 'Electronics',
    price: 199.99,
    costPrice: 120.00,
    stock: 45,
    images: [],
    status: 'active',
    tags: ['wireless', 'audio', 'premium'],
    createdAt: '2025-01-10T10:30:00Z',
    updatedAt: '2025-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Cotton T-Shirt',
    description: 'Comfortable cotton t-shirt in various colors',
    sku: 'TS-002',
    category: 'Clothing',
    price: 29.99,
    costPrice: 15.00,
    stock: 5,
    images: [],
    status: 'active',
    tags: ['clothing', 'cotton', 'casual'],
    createdAt: '2025-01-08T14:20:00Z',
    updatedAt: '2025-01-12T09:15:00Z',
  },
  {
    id: '3',
    name: 'JavaScript: The Complete Guide',
    description: 'Comprehensive guide to JavaScript programming',
    sku: 'BK-003',
    category: 'Books',
    price: 49.99,
    costPrice: 25.00,
    stock: 0,
    images: [],
    status: 'out_of_stock',
    tags: ['books', 'programming', 'javascript'],
    createdAt: '2025-01-05T16:45:00Z',
    updatedAt: '2025-01-14T12:30:00Z',
  },
  {
    id: '4',
    name: 'Garden Planter Set',
    description: 'Set of 3 ceramic planters for indoor plants',
    sku: 'GP-004',
    category: 'Home & Garden',
    price: 89.99,
    costPrice: 45.00,
    stock: 22,
    images: [],
    status: 'active',
    tags: ['garden', 'plants', 'ceramic'],
    createdAt: '2025-01-03T11:15:00Z',
    updatedAt: '2025-01-10T08:45:00Z',
  },
];

function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockProducts;
    },
  });
}

export default function ProductsPage() {
  const { data: products = [], isLoading, refetch } = useProducts();

  const stats = {
    total: products.length,
    active: products.filter(p => p.status === 'active').length,
    lowStock: products.filter(p => p.stock < 10).length,
    outOfStock: products.filter(p => p.status === 'out_of_stock').length,
  };

  return (
    <div>
      <Header title="Products" />
      <main className="container mx-auto p-4 md:p-6">
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Products</h2>
              <p className="text-muted-foreground">
                Manage your product inventory and catalog
              </p>
            </div>
              <div className="flex space-x-2">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </div>
            </div>

            {/* Product Stats */}
            <div className="grid gap-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <p className="text-xs text-muted-foreground">
                    Total products in catalog
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Products</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.active}</div>
                  <p className="text-xs text-green-600">
                    Currently available
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.lowStock}</div>
                  <p className="text-xs text-green-600">
                    Less than 10 items
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.outOfStock}</div>
                  <p className="text-xs text-red-600">
                    Needs restocking
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Products Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Products</CardTitle>
                <CardDescription>
                  A list of all products in your inventory
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={productColumns}
                  data={products}
                  searchPlaceholder="Search products..."
                  isLoading={isLoading}
                  onRefresh={refetch}
                />
              </CardContent>
            </Card>
          </div>
        </main>
    </div>
  );
}