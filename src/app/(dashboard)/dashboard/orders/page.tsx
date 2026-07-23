'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/shared/data-table';
import { orderColumns } from '@/components/features/orders/order-columns';
import { Order } from '@/types';
import { Plus, Download } from 'lucide-react';
import { Header } from '@/components/layout/header';

// Mock data - replace with actual API call
const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-001',
    customerId: 'c1',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    status: 'processing',
    totalAmount: 299.99,
    currency: 'USD',
    items: [],
    shippingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      postalCode: '10001',
    },
    billingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      postalCode: '10001',
    },
    paymentMethod: 'Credit Card',
    createdAt: '2025-01-15T10:30:00Z',
    updatedAt: '2025-01-15T10:30:00Z',
  },
  {
    id: '2',
    orderNumber: 'ORD-002',
    customerId: 'c2',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    status: 'shipped',
    totalAmount: 149.99,
    currency: 'USD',
    items: [],
    shippingAddress: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA',
      postalCode: '90210',
    },
    billingAddress: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA',
      postalCode: '90210',
    },
    paymentMethod: 'PayPal',
    createdAt: '2025-01-14T14:20:00Z',
    updatedAt: '2025-01-15T09:15:00Z',
  },
  {
    id: '3',
    orderNumber: 'ORD-003',
    customerId: 'c3',
    customerName: 'Bob Johnson',
    customerEmail: 'bob@example.com',
    status: 'delivered',
    totalAmount: 89.99,
    currency: 'USD',
    items: [],
    shippingAddress: {
      street: '789 Pine Rd',
      city: 'Chicago',
      state: 'IL',
      country: 'USA',
      postalCode: '60601',
    },
    billingAddress: {
      street: '789 Pine Rd',
      city: 'Chicago',
      state: 'IL',
      country: 'USA',
      postalCode: '60601',
    },
    paymentMethod: 'Credit Card',
    createdAt: '2025-01-13T16:45:00Z',
    updatedAt: '2025-01-14T12:30:00Z',
  },
];

function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockOrders;
    },
  });
}

export default function OrdersPage() {
  const { data: orders = [], isLoading, refetch } = useOrders();

  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div>
      <Header title="Orders" />
      <main className="container mx-auto p-4 md:p-6">
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
              <p className="text-muted-foreground">
                Manage and track customer orders
                </p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Order
                </Button>
              </div>
            </div>

            {/* Status Overview */}
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {Object.entries({
                pending: { label: 'Pending', color: 'bg-green-100 text-green-800' },
                processing: { label: 'Processing', color: 'bg-blue-100 text-blue-800' },
                shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-800' },
                delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800' },
                cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
              }).map(([status, { label }]) => (
                <Card key={status}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {statusCounts[status] || 0}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Orders Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Orders</CardTitle>
                <CardDescription>
                  A list of all orders in your store
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={orderColumns}
                  data={orders}
                  searchPlaceholder="Search orders..."
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