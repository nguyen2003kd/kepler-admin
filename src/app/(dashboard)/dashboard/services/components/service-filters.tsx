'use client';

import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

import type { ServiceFilters, ServiceCategory, ServiceType } from '../lib/types';
import { getServiceCategories, getServiceTypes } from '../lib/api';
import { filterServiceTypesByCategory } from '../lib/utils';
import { SERVICE_SEARCH_PLACEHOLDER } from '../lib/constants';

interface ServiceFiltersProps {
  filters: ServiceFilters;
  onFiltersChange: (filters: ServiceFilters) => void;
  onClearFilters: () => void;
  isLoading?: boolean;
}

export default function ServiceFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  isLoading = false,
}: ServiceFiltersProps) {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [filteredServiceTypes, setFilteredServiceTypes] = useState<ServiceType[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Load categories and service types
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
        console.error('Error loading filter data:', error);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, []);

  // Filter service types when category filter changes
  useEffect(() => {
    if (filters.categoryId) {
      const filtered = filterServiceTypesByCategory(serviceTypes, filters.categoryId);
      setFilteredServiceTypes(filtered);
      
      // Clear service type filter if it doesn't belong to selected category
      if (filters.serviceTypeId && !filtered.find(st => st.id === filters.serviceTypeId)) {
        onFiltersChange({ ...filters, serviceTypeId: undefined });
      }
    } else {
      setFilteredServiceTypes(serviceTypes);
    }
  }, [filters.categoryId, serviceTypes, filters.serviceTypeId, filters, onFiltersChange]);

  const handleFilterChange = (key: keyof ServiceFilters, value: string | undefined) => {
    const newFilters = { ...filters };
    
    if (value === undefined) {
      delete newFilters[key];
    } else {
      // Type-safe assignment
      if (key === 'status' && (value === 'active' || value === 'inactive')) {
        newFilters[key] = value as 'active' | 'inactive';
      } else if (key === 'search' || key === 'categoryId' || key === 'serviceTypeId') {
        (newFilters as Record<string, unknown>)[key] = value;
      }
    }
    
    onFiltersChange(newFilters);
  };

  const handleSearchChange = (value: string) => {
    handleFilterChange('search', value || undefined);
  };

  const getActiveFiltersCount = (): number => {
    let count = 0;
    if (filters.search) count++;
    if (filters.categoryId) count++;
    if (filters.serviceTypeId) count++;
    if (filters.status) count++;
    if (filters.dateFrom) count++;
    if (filters.dateTo) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder={SERVICE_SEARCH_PLACEHOLDER}
          value={filters.search || ''}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
          disabled={isLoading || isLoadingData}
        />
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Category Filter */}
        <div className="min-w-[180px]">
          <Select
            value={filters.categoryId || 'all'}
            onValueChange={(value) => handleFilterChange('categoryId', value === 'all' ? undefined : value)}
            disabled={isLoading || isLoadingData}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tất cả danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả danh mục</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Service Type Filter */}
        <div className="min-w-[180px]">
          <Select
            value={filters.serviceTypeId || 'all'}
            onValueChange={(value) => handleFilterChange('serviceTypeId', value === 'all' ? undefined : value)}
            disabled={isLoading || isLoadingData || !filters.categoryId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tất cả loại dịch vụ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả loại dịch vụ</SelectItem>
              {filteredServiceTypes.map((serviceType) => (
                <SelectItem key={serviceType.id} value={serviceType.id}>
                  {serviceType.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="min-w-[140px]">
          <Select
            value={filters.status || 'all'}
            onValueChange={(value) => handleFilterChange('status', value === 'all' ? undefined : value)}
            disabled={isLoading || isLoadingData}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="active">Hoạt động</SelectItem>
              <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="text-gray-600"
          >
            <X className="h-4 w-4 mr-1" />
            Xóa bộ lọc ({activeFiltersCount})
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="secondary" className="text-xs">
              Tìm kiếm: &quot;{filters.search}&quot;
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => handleFilterChange('search', undefined)}
              />
            </Badge>
          )}
          
          {filters.categoryId && (
            <Badge variant="secondary" className="text-xs">
              Danh mục: {categories.find(c => c.id === filters.categoryId)?.name}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => handleFilterChange('categoryId', undefined)}
              />
            </Badge>
          )}
          
          {filters.serviceTypeId && (
            <Badge variant="secondary" className="text-xs">
              Loại: {serviceTypes.find(st => st.id === filters.serviceTypeId)?.name}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => handleFilterChange('serviceTypeId', undefined)}
              />
            </Badge>
          )}
          
          {filters.status && (
            <Badge variant="secondary" className="text-xs">
              Trạng thái: {filters.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => handleFilterChange('status', undefined)}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}