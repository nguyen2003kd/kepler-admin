'use client';

import React, { useState, useMemo } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronDown, ChevronRight, Folder, FolderOpen, Tag, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  code?: string;
  parent_category_id?: string | null;
  position?: number | null;
  categories?: Category[]; // For nested structure from API
  children?: Category[]; // For built tree structure
}

interface HierarchicalCategorySelectorProps {
  categories: Category[];
  selectedCategories: string[];
  onSelectionChange: (categoryIds: string[]) => void;
  maxHeight?: string;
  showSearch?: boolean;
  showSelectAll?: boolean;
}

interface CategoryTreeItemProps {
  category: Category;
  childCategories: Category[];
  selectedCategories: string[];
  onToggleCategory: (categoryId: string, checked: boolean) => void;
  onToggleWithChildren: (categoryId: string, checked: boolean) => void;
  level: number;
  searchTerm: string;
  isSearchMatch: boolean;
}

function CategoryTreeItem({ 
  category, 
  childCategories, 
  selectedCategories, 
  onToggleCategory,
  onToggleWithChildren, 
  level,
  searchTerm,
  isSearchMatch
}: CategoryTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = childCategories.length > 0;
  const isSelected = selectedCategories.includes(category.id);
  
  // Check if all children are selected
  const allChildrenSelected = hasChildren && childCategories.every(child => 
    selectedCategories.includes(child.id)
  );
  
  // Check if some children are selected
  const someChildrenSelected = hasChildren && childCategories.some(child => 
    selectedCategories.includes(child.id)
  );
  
  const indentation = level * 20;

  // Filter children based on search
  const filteredChildren = useMemo(() => {
    if (!searchTerm) return childCategories;
    return childCategories.filter(child => 
      child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      child.code?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [childCategories, searchTerm]);

  // Check if this item or any children match search
  const hasMatchingChildren = filteredChildren.length > 0;
  const shouldShow = !searchTerm || isSearchMatch || hasMatchingChildren;

  if (!shouldShow) return null;

  const handleSingleToggle = (checked: boolean) => {
    onToggleCategory(category.id, checked);
  };

  const handleToggleWithChildren = (checked: boolean) => {
    onToggleWithChildren(category.id, checked);
  };

  return (
    <div className="w-full">
      <div 
        className={cn(
          "flex items-center space-x-2 py-2 px-2 hover:bg-gray-50 rounded-sm transition-colors",
          isSelected && "bg-blue-50",
          isSearchMatch && "bg-green-50"
        )}
        style={{ paddingLeft: `${indentation + 8}px` }}
      >
        {hasChildren ? (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-center w-5 h-5 text-gray-500 hover:text-gray-700 transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        ) : (
          <div className="w-5 h-5" />
        )}
        
        <div className="flex items-center space-x-2">
          {hasChildren ? (
            isExpanded ? (
              <FolderOpen className="h-4 w-4 text-blue-500" />
            ) : (
              <Folder className="h-4 w-4 text-blue-500" />
            )
          ) : (
            <Tag className="h-4 w-4 text-gray-400" />
          )}
        </div>

        <Checkbox
          id={`category-${category.id}`}
          checked={isSelected}
          onCheckedChange={handleSingleToggle}
          className={cn(
            someChildrenSelected && !allChildrenSelected && !isSelected && "data-[state=checked]:bg-orange-500"
          )}
        />
        
        <Label 
          htmlFor={`category-${category.id}`}
          className={cn(
            "cursor-pointer text-sm flex-1 select-none",
            isSelected && "font-medium text-blue-700",
            level === 0 && "font-semibold text-gray-900",
            level > 0 && "text-gray-700",
            isSearchMatch && "bg-green-200 px-1 rounded"
          )}
        >
          <span className="flex items-center justify-between">
            <span>
              {category.name}
              {category.code && (
                <span className="ml-2 text-xs text-gray-500 font-mono bg-gray-100 px-1 rounded">
                  {category.code}
                </span>
              )}
            </span>
            {hasChildren && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs ml-2"
                onClick={(e) => {
                  e.preventDefault();
                  handleToggleWithChildren(!isSelected);
                }}
              >
                {isSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
              </Button>
            )}
          </span>
        </Label>
      </div>

      {hasChildren && isExpanded && (
        <div className="ml-2">
          {(searchTerm ? filteredChildren : childCategories).map((child) => (
            <CategoryTreeItem
              key={child.id}
              category={child}
              childCategories={child.categories || []}
              selectedCategories={selectedCategories}
              onToggleCategory={onToggleCategory}
              onToggleWithChildren={onToggleWithChildren}
              level={level + 1}
              searchTerm={searchTerm}
              isSearchMatch={!searchTerm ? false : 
                (child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (child.code?.toLowerCase().includes(searchTerm.toLowerCase()) || false))
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function HierarchicalCategorySelector({
  categories,
  selectedCategories,
  onSelectionChange,
  maxHeight = "80",
  showSearch = true,
  showSelectAll = true
}: HierarchicalCategorySelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Build tree structure from flat categories array or use nested structure from API
  const categoryTree = useMemo(() => {
    // If categories already have nested structure (from API), use it
    if (categories.some(cat => cat.categories && cat.categories.length > 0)) {
      return categories.filter(cat => !cat.parent_category_id);
    }

    // Otherwise, build tree structure from flat array
    const categoryMap = new Map<string, Category & { children: Category[] }>();
    
    // First pass: create map with all categories
    categories.forEach(category => {
      categoryMap.set(category.id, { ...category, children: [] });
    });
    
    // Second pass: build parent-child relationships
    const rootCategories: (Category & { children: Category[] })[] = [];
    
    categories.forEach(category => {
      const categoryWithChildren = categoryMap.get(category.id)!;
      
      if (category.parent_category_id) {
        const parent = categoryMap.get(category.parent_category_id);
        if (parent) {
          parent.children.push(categoryWithChildren);
        } else {
          rootCategories.push(categoryWithChildren);
        }
      } else {
        rootCategories.push(categoryWithChildren);
      }
    });
    
    // Sort by position
    const sortCategories = (cats: (Category & { children: Category[] })[]) => {
      return cats.sort((a, b) => (a.position || 0) - (b.position || 0));
    };
    
    const sortRecursive = (cats: (Category & { children: Category[] })[]) => {
      const sorted = sortCategories(cats);
      sorted.forEach(cat => {
        if (cat.children.length > 0) {
          cat.children = sortRecursive(cat.children as (Category & { children: Category[] })[]);
        }
      });
      return sorted;
    };
    
    return sortRecursive(rootCategories);
  }, [categories]);

  const handleToggleCategory = (categoryId: string, checked: boolean) => {
      let newSelection = [...selectedCategories];
      
      // Helper to find parent id - works with both flat and nested structures
      const findParentId = (catId: string): string | null => {
        // First try to find in flat structure with parent_category_id
        const cat = categories.find(c => c.id === catId);
        if (cat?.parent_category_id) {
          return cat.parent_category_id;
        }
        
        // If not found, search in nested structure
        const findParentInNested = (cats: Category[], targetId: string): string | null => {
          for (const category of cats) {
            // Check direct children in categories array
            if (category.categories && category.categories.some(child => child.id === targetId)) {
              return category.id;
            }
            // Check direct children in children array (for built tree)
            if (category.children && category.children.some(child => child.id === targetId)) {
              return category.id;
            }
            // Recursively search in nested children
            if (category.categories) {
              const foundParent = findParentInNested(category.categories, targetId);
              if (foundParent) return foundParent;
            }
            if (category.children) {
              const foundParent = findParentInNested(category.children, targetId);
              if (foundParent) return foundParent;
            }
          }
          return null;
        };
        
        return findParentInNested(categories, catId);
      };

      // Get all child IDs recursively
      const getAllChildIds = (catId: string): string[] => {
        const category = categories.find(c => c.id === catId);
        if (!category) return [];
        
        let childIds: string[] = [];
        
        // Check if using nested API structure
        if (category.categories) {
          category.categories.forEach(child => {
            childIds.push(child.id);
            childIds = childIds.concat(getAllChildIds(child.id));
          });
        } else {
          // Fallback to flat structure
          const directChildren = categories.filter(c => c.parent_category_id === catId);
          directChildren.forEach(child => {
            childIds.push(child.id);
            childIds = childIds.concat(getAllChildIds(child.id));
          });
        }
        
        return childIds;
      };

      if (checked) {
        // Add this category
        if (!newSelection.includes(categoryId)) {
          newSelection.push(categoryId);
        }
        // Recursively add parent categories
        let parentId = findParentId(categoryId);
        while (parentId) {
          if (!newSelection.includes(parentId)) {
            newSelection.push(parentId);
          }
          parentId = findParentId(parentId);
        }
      } else {
        // Remove this category and ALL its children
        const childIds = getAllChildIds(categoryId);
        newSelection = newSelection.filter(id => id !== categoryId && !childIds.includes(id));
      }
      onSelectionChange(newSelection);
  };

  const handleToggleWithChildren = (categoryId: string, checked: boolean) => {
    let newSelection = [...selectedCategories];
    
    // Helper to find parent id - works with both flat and nested structures
    const findParentId = (catId: string): string | null => {
      // First try to find in flat structure with parent_category_id
      const cat = categories.find(c => c.id === catId);
      if (cat?.parent_category_id) {
        return cat.parent_category_id;
      }
      
      // If not found, search in nested structure
      const findParentInNested = (cats: Category[], targetId: string): string | null => {
        for (const category of cats) {
          // Check direct children in categories array
          if (category.categories && category.categories.some(child => child.id === targetId)) {
            return category.id;
          }
          // Check direct children in children array (for built tree)
          if (category.children && category.children.some(child => child.id === targetId)) {
            return category.id;
          }
          // Recursively search in nested children
          if (category.categories) {
            const foundParent = findParentInNested(category.categories, targetId);
            if (foundParent) return foundParent;
          }
          if (category.children) {
            const foundParent = findParentInNested(category.children, targetId);
            if (foundParent) return foundParent;
          }
        }
        return null;
      };
      
      return findParentInNested(categories, catId);
    };
    
    // Get all child IDs recursively
    const getAllChildIds = (catId: string): string[] => {
      const category = categories.find(c => c.id === catId);
      if (!category) return [];
      
      let childIds: string[] = [];
      
      // Check if using nested API structure
      if (category.categories) {
        category.categories.forEach(child => {
          childIds.push(child.id);
          childIds = childIds.concat(getAllChildIds(child.id));
        });
      } else {
        // Fallback to flat structure
        const directChildren = categories.filter(c => c.parent_category_id === catId);
        directChildren.forEach(child => {
          childIds.push(child.id);
          childIds = childIds.concat(getAllChildIds(child.id));
        });
      }
      
      return childIds;
    };

    const childIds = getAllChildIds(categoryId);
    
    if (checked) {
      // Add category and all children
      if (!newSelection.includes(categoryId)) {
        newSelection.push(categoryId);
      }
      childIds.forEach(id => {
        if (!newSelection.includes(id)) {
          newSelection.push(id);
        }
      });
      
      // Also select parent categories
      let parentId = findParentId(categoryId);
      while (parentId) {
        if (!newSelection.includes(parentId)) {
          newSelection.push(parentId);
        }
        parentId = findParentId(parentId);
      }
    } else {
      // Remove category and all children
      newSelection = newSelection.filter(id => id !== categoryId && !childIds.includes(id));
    }
    
    onSelectionChange(newSelection);
  };

  const handleSelectAll = () => {
    const allIds = categories.map(cat => cat.id);
    onSelectionChange(allIds);
  };

  const handleClearAll = () => {
    onSelectionChange([]);
  };

  const selectedCategoryData = useMemo(() => {
    return categories.filter(cat => selectedCategories.includes(cat.id));
  }, [categories, selectedCategories]);

  // Filter tree based on search
  const filteredTree = useMemo(() => {
    if (!searchTerm) return categoryTree;
    
    const filterTree = (tree: (Category & { children?: Category[] })[]): (Category & { children?: Category[] })[] => {
      return tree.filter(category => {
        const matches = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       (category.code?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
        
        const hasMatchingChildren = category.children && 
          filterTree(category.children).length > 0;
        
        return matches || hasMatchingChildren;
      }).map(category => ({
        ...category,
        children: category.children ? filterTree(category.children) : []
      }));
    };
    
    return filterTree(categoryTree);
  }, [categoryTree, searchTerm]);

  return (
    <div className="space-y-4">
      {/* Search and Actions */}
      {(showSearch || showSelectAll) && (
        <div className="flex flex-col sm:flex-row gap-3">
          {showSearch && (
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm danh mục..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-8"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
          
          {showSelectAll && (
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                className="whitespace-nowrap"
              >
                Chọn tất cả
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                disabled={selectedCategories.length === 0}
                className="whitespace-nowrap"
              >
                Bỏ chọn tất cả
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Category Tree */}
      <div className={`border rounded-lg p-4 bg-white overflow-auto`} style={{ maxHeight: `${maxHeight}vh` }}>
        {filteredTree.length > 0 ? (
          <div className="space-y-1">
            {filteredTree.map((category) => (
              <CategoryTreeItem
                key={category.id}
                category={category}
                childCategories={category.categories || category.children || []}
                selectedCategories={selectedCategories}
                onToggleCategory={handleToggleCategory}
                onToggleWithChildren={handleToggleWithChildren}
                level={0}
                searchTerm={searchTerm}
                isSearchMatch={!searchTerm ? false : 
                  (category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (category.code?.toLowerCase().includes(searchTerm.toLowerCase()) || false))
                }
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? (
              <div>
                <Search className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>Không tìm thấy danh mục nào khớp với &ldquo;{searchTerm}&rdquo;</p>
              </div>
            ) : (
              <div>
                <Folder className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>Không có danh mục nào</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Selected Categories Display */}
      {selectedCategories.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-gray-700">
              Đã chọn ({selectedCategories.length} danh mục)
            </Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Xóa tất cả
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-gray-50 rounded-lg">
            {selectedCategoryData.map((category) => (
              <Badge 
                key={category.id} 
                variant="secondary" 
                className="text-xs flex items-center gap-1 bg-blue-100 text-blue-800 border-blue-200"
              >
                {category.name}
                {category.code && (
                  <span className="text-blue-600">({category.code})</span>
                )}
                <button
                  onClick={() => handleToggleCategory(category.id, false)}
                  className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}