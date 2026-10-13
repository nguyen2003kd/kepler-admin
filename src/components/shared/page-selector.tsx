'use client';

import React, { useMemo, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageItem {
  id: string;
  name?: string | null;
  path?: string | null;
  type?: string | null;
}

interface PageSelectorProps {
  pages: PageItem[];
  selectedPageIds: string[];
  onSelectionChange: (pageIds: string[]) => void;
  maxHeight?: string;
}

export function PageSelector({
  pages,
  selectedPageIds,
  onSelectionChange,
  maxHeight = '300px',
}: PageSelectorProps) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return pages;
    return pages.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) || p.path?.toLowerCase().includes(q),
    );
  }, [pages, search]);

  const toggle = (id: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedPageIds, id]);
    } else {
      onSelectionChange(selectedPageIds.filter((v) => v !== id));
    }
  };

  const selectAll = () => {
    onSelectionChange(Array.from(new Set([...selectedPageIds, ...filtered.map((p) => p.id)])));
  };

  const clearAll = () => {
    const filteredIds = new Set(filtered.map((p) => p.id));
    onSelectionChange(selectedPageIds.filter((id) => !filteredIds.has(id)));
  };

  return (
    <div className='rounded-md border'>
      <div className='flex items-center gap-2 border-b p-2'>
        <div className='relative flex-1'>
          <Search className='absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Tìm trang...'
            className='h-8 pl-8'
          />
        </div>
        <Button type='button' variant='outline' size='sm' onClick={selectAll}>
          Chọn tất cả
        </Button>
        <Button type='button' variant='outline' size='sm' onClick={clearAll}>
          <X className='h-3 w-3' />
        </Button>
      </div>
      <div className='overflow-y-auto p-2' style={{ maxHeight }}>
        {filtered.length === 0 ? (
          <p className='py-4 text-center text-sm text-muted-foreground'>Không có trang nào</p>
        ) : (
          filtered.map((page) => {
            const checked = selectedPageIds.includes(page.id);
            return (
              <div
                key={page.id}
                className={cn(
                  'flex items-center gap-2 rounded px-2 py-1.5 hover:bg-muted/50',
                  checked && 'bg-muted/70',
                )}
              >
                <Checkbox
                  id={`page-${page.id}`}
                  checked={checked}
                  onCheckedChange={(v) => toggle(page.id, v === true)}
                />
                <Label
                  htmlFor={`page-${page.id}`}
                  className='flex flex-1 cursor-pointer items-center gap-2 text-sm font-normal'
                >
                  <span>{page.name}</span>
                  {page.path && (
                    <span className='font-mono text-xs text-muted-foreground'>{page.path}</span>
                  )}
                </Label>
                {page.type === 'NEWS' ? (
                  <Badge variant='secondary' className='text-xs'>Tin tức</Badge>
                ) : (
                  <Badge variant='outline' className='text-xs'>Thiết kế</Badge>
                )}
              </div>
            );
          })
        )}
      </div>
      <div className='border-t px-2 py-1.5 text-xs text-muted-foreground'>
        Đã chọn {selectedPageIds.length} trang
      </div>
    </div>
  );
}

