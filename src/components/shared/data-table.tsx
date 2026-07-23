"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Settings2,
  RefreshCw,
  TableIcon,
} from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchPlaceholder?: string;
  isLoading?: boolean;
  onRefresh?: () => void;
  onLoadMore?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  searchColumns?: string[];
  onSearch?: (q: string) => void;
  debounceMs?: number;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchPlaceholder = "Tìm kiếm...",
  isLoading = false,
  onRefresh,
  onLoadMore,
  hasNextPage,
  isFetchingNextPage,
  onSearch,
  debounceMs = 300,
}: DataTableProps<TData, TValue>) {
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [searchInput, setSearchInput] = React.useState("");

  // Khi dùng infinite query (có onLoadMore), không dùng pagination
  const isInfiniteMode = Boolean(onLoadMore);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...(isInfiniteMode
      ? {}
      : { getPaginationRowModel: getPaginationRowModel() }),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
    // Trong infinite mode, hiển thị tất cả rows (không phân trang)
    ...(isInfiniteMode ? { manualPagination: true } : {}),
  });

  // debounce search input and propagate to table/global filter + parent onSearch
  React.useEffect(() => {
    const id = setTimeout(() => {
      setGlobalFilter(searchInput);
      onSearch?.(searchInput);
    }, debounceMs);
    return () => clearTimeout(id);
  }, [searchInput, debounceMs, onSearch]);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder={searchPlaceholder}
              value={searchInput ?? ""}
              onChange={(event) => setSearchInput(String(event.target.value))}
              className="w-full sm:w-80 pl-10 bg-white border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all rounded-lg"
            />
          </div>
          <Badge
            variant="secondary"
            className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 font-medium whitespace-nowrap"
          >
            {table.getFilteredRowModel().rows.length} dòng
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="bg-white hover:bg-gray-50 border-gray-200 text-gray-700 gap-2 shadow-sm"
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Làm mới</span>
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="bg-white hover:bg-gray-50 border-gray-200 text-gray-700 gap-2 shadow-sm"
              >
                <Settings2 className="h-4 w-4" />
                <span className="hidden sm:inline">Hiển thị</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 p-2 bg-white shadow-lg border border-gray-100 rounded-xl"
            >
              <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Chọn cột hiển thị
              </div>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  const header = column.columnDef.header;
                  const displayName = typeof header === 'string' 
                    ? header 
                    : (column.columnDef.meta as { title?: string })?.title || column.id;
                  
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize rounded-md cursor-pointer"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {displayName}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-lg overflow-hidden">
        <div ref={scrollRef} className="max-h-[520px] overflow-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-800 hover:to-slate-700 border-0"
                >
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="text-white font-semibold tracking-wide py-4 px-5 text-sm first:rounded-tl-none last:rounded-tr-none"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={`
                      transition-all duration-150 border-gray-100
                      hover:bg-blue-50/50 
                      ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"}
                      ${
                        row.getIsSelected()
                          ? "bg-blue-50 hover:bg-blue-100"
                          : ""
                      }
                    `}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="py-4 px-5 text-gray-700"
                      >
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
                    className="h-40 text-center"
                  >
                    {isLoading ? (
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-gray-500 font-medium">
                          Đang tải dữ liệu...
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-3 text-gray-400">
                        <TableIcon className="w-12 h-12 opacity-50" />
                        <div>
                          <p className="font-medium text-gray-500">
                            Không có dữ liệu
                          </p>
                          <p className="text-sm">
                            Thử thay đổi bộ lọc hoặc thêm dữ liệu mới
                          </p>
                        </div>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {onLoadMore && (
            <div aria-hidden>
              <InfiniteLoader
                onLoadMore={onLoadMore}
                enabled={Boolean(hasNextPage)}
                loading={Boolean(isFetchingNextPage)}
                rootRef={scrollRef}
              />
            </div>
          )}
        </div>

        {/* Loading more indicator */}
        {isFetchingNextPage && (
          <div className="flex items-center justify-center gap-2 py-4 bg-gradient-to-t from-gray-50 to-white border-t border-gray-100">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-gray-500">Đang tải thêm...</span>
          </div>
        )}
      </div>

      {/* Pagination - chỉ hiển thị khi không dùng infinite mode */}
      {!isInfiniteMode ? (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="text-sm text-gray-500 order-2 sm:order-1">
            <span className="font-medium text-gray-700">
              {table.getFilteredSelectedRowModel().rows.length}
            </span>
            {" / "}
            <span className="font-medium text-gray-700">
              {table.getFilteredRowModel().rows.length}
            </span>{" "}
            dòng được chọn
          </div>
          <div className="flex items-center gap-4 order-1 sm:order-2">
            <div className="flex items-center justify-center px-3 py-1.5 bg-gray-50 rounded-lg text-sm font-medium text-gray-700 border border-gray-200">
              Trang {table.getState().pagination.pageIndex + 1} /{" "}
              {table.getPageCount() || 1}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                className="hidden sm:flex h-9 w-9 p-0 bg-white hover:bg-gray-50 border-gray-200 shadow-sm"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Trang đầu</span>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-9 w-9 p-0 bg-white hover:bg-gray-50 border-gray-200 shadow-sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Trang trước</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-9 w-9 p-0 bg-white hover:bg-gray-50 border-gray-200 shadow-sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Trang sau</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden sm:flex h-9 w-9 p-0 bg-white hover:bg-gray-50 border-gray-200 shadow-sm"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Trang cuối</span>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* Infinite mode: hiển thị thông tin đơn giản */
        <div className="flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="text-sm text-gray-500">
            <span className="font-medium text-gray-700">
              {table.getFilteredRowModel().rows.length}
            </span>{" "}
            dòng đã tải
            {hasNextPage && (
              <span className="text-blue-600 ml-2">
                • Cuộn xuống để tải thêm
              </span>
            )}
          </div>
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <div className="text-sm text-gray-500">
              <span className="font-medium text-blue-600">
                {table.getFilteredSelectedRowModel().rows.length}
              </span>{" "}
              dòng được chọn
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function InfiniteLoader({
  onLoadMore,
  enabled,
  loading,
  rootRef,
}: {
  onLoadMore?: () => void;
  enabled?: boolean;
  loading?: boolean;
  rootRef?: React.RefObject<HTMLElement>;
}) {
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const el = ref.current;
    const rootEl = rootRef?.current ?? null;
    // don't observe until we have the sentinel element and (if provided) a mounted root
    if (!el || !enabled) return;
    if (rootRef && !rootEl) return;
    // if the scroll container is present but not scrollable yet, skip observing
    if (rootEl && rootEl.scrollHeight <= rootEl.clientHeight) return;

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          if (!loading) onLoadMore?.();
        }
      },
      { root: rootEl, rootMargin: "100px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [onLoadMore, enabled, loading, rootRef]);

  return <div ref={ref} className="h-1" aria-hidden />;
}
