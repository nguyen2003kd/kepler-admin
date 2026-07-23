'use client';

import React, { useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { MoreHorizontal, Edit2, Trash2, Power, PowerOff } from 'lucide-react';

import type { Service } from '../lib/types';
import { formatServiceDate, formatServiceStatus, getServiceStatusColor } from '../lib/utils';
import { SERVICE_FORM_LABELS } from '../lib/constants';

interface ServiceTableProps {
  services: Service[];
  isLoading?: boolean;
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
  onStatusChange: (service: Service, status: 'active' | 'inactive') => void;
  onSelectionChange?: (selectedIds: string[]) => void;
}

export default function ServiceTable({
  services,
  isLoading = false,
  onEdit,
  onDelete,
  onStatusChange,
  onSelectionChange,
}: ServiceTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});

  // Define columns
  const columns: ColumnDef<Service>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 50,
    },
    {
      accessorKey: 'serviceCode',
      header: 'Mã dịch vụ',
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.getValue('serviceCode')}</div>
      ),
      size: 120,
    },
    {
      accessorKey: 'name',
      header: 'Tên dịch vụ',
      cell: ({ row }) => (
        <div className="min-w-[200px]">
          <div className="font-medium">{row.getValue('name')}</div>
          <div className="text-sm text-gray-500 mt-1">
            {row.original.category?.name} / {row.original.serviceType?.name}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: ({ row }) => {
        const status = row.getValue('status') as 'active' | 'inactive';
        return (
          <Badge className={getServiceStatusColor(status)}>
            {formatServiceStatus(status)}
          </Badge>
        );
      },
      size: 120,
    },
    {
      accessorKey: 'createdAt',
      header: 'Ngày tạo',
      cell: ({ row }) => (
        <div className="text-sm">{formatServiceDate(row.getValue('createdAt'))}</div>
      ),
      size: 140,
    },
    {
      id: 'actions',
      header: 'Thao tác',
      cell: ({ row }) => {
        const service = row.original;
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(service)}>
                <Edit2 className="mr-2 h-4 w-4" />
                {SERVICE_FORM_LABELS.edit}
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              {service.status === 'active' ? (
                <DropdownMenuItem 
                  onClick={() => onStatusChange(service, 'inactive')}
                  className="text-orange-600"
                >
                  <PowerOff className="mr-2 h-4 w-4" />
                  Ngừng hoạt động
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem 
                  onClick={() => onStatusChange(service, 'active')}
                  className="text-green-600"
                >
                  <Power className="mr-2 h-4 w-4" />
                  Kích hoạt
                </DropdownMenuItem>
              )}
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem
                onClick={() => onDelete(service)}
                className="text-red-600"
                disabled={service.status === 'active'}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {SERVICE_FORM_LABELS.delete}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableSorting: false,
      size: 80,
    },
  ];

  const table = useReactTable({
    data: services,
    columns,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
  });

  // Notify parent of selection changes
  React.useEffect(() => {
    if (onSelectionChange) {
      const selectedRowModel = table.getFilteredSelectedRowModel();
      const selectedIds = selectedRowModel.rows.map((row) => row.original.id);
      onSelectionChange(selectedIds);
    }
  }, [rowSelection, onSelectionChange, table]);

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <div className="p-8 text-center">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-4 bg-gray-100 rounded w-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} style={{ width: header.getSize() }}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-gray-500"
                >
                  Không có dịch vụ nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <span>
              Đã chọn {table.getFilteredSelectedRowModel().rows.length} trong số{' '}
              {table.getFilteredRowModel().rows.length} dịch vụ
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Trước
          </Button>
          
          <span className="text-sm text-gray-600">
            Trang {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Sau
          </Button>
        </div>
      </div>
    </div>
  );
}