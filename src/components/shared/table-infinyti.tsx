// 'use client';

// import * as React from 'react';
// import { useEffect, useRef, useCallback, useMemo } from 'react';
// import {
//   ColumnDef,
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getSortedRowModel,
//   useReactTable,
//   ColumnFiltersState,
//   SortingState,
//   VisibilityState,
// } from '@tanstack/react-table';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Badge } from '@/components/ui/badge';
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { Search, RefreshCw, Settings2 } from 'lucide-react';

// interface InfiniteDataTableProps<TData, TValue> {
//   columns: ColumnDef<TData, TValue>[];
//   data: TData[];
//   searchPlaceholder?: string;
//   isLoading?: boolean;
//   hasNextPage?: boolean;
//   isFetchingNextPage?: boolean;
//   onLoadMore?: () => void;
//   onRefresh?: () => void;
//   loadingThreshold?: number; 
// }

// export function InfiniteDataTable<TData, TValue>({
//   columns,
//   data,
//   searchPlaceholder = 'Search...',
//   isLoading = false,
//   hasNextPage = false,
//   isFetchingNextPage = false,
//   onLoadMore,
//   onRefresh,
//   loadingThreshold = 0.8,
// }: InfiniteDataTableProps<TData, TValue>) {
//   const [sorting, setSorting] = React.useState<SortingState>([]);
//   const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
//   const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
//   const [globalFilter, setGlobalFilter] = React.useState('');
  
//   const tableContainerRef = useRef<HTMLDivElement>(null);

//   const table = useReactTable({
//     data,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     onColumnVisibilityChange: setColumnVisibility,
//     onGlobalFilterChange: setGlobalFilter,
//     state: {
//       sorting,
//       columnFilters,
//       columnVisibility,
//       globalFilter,
//     },
//   });

//   // Infinite scroll handler
//   const handleScroll = useCallback(() => {
//     if (!tableContainerRef.current || !hasNextPage || isFetchingNextPage) return;
    
//     const { scrollTop, scrollHeight, clientHeight } = tableContainerRef.current;
//     const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
    
//     if (scrollPercentage >= loadingThreshold && onLoadMore) {
//       onLoadMore();
//     }
//   }, [hasNextPage, isFetchingNextPage, loadingThreshold, onLoadMore]);

//   useEffect(() => {
//     const container = tableContainerRef.current;
//     if (!container) return;
    
//     container.addEventListener('scroll', handleScroll);
//     return () => container.removeEventListener('scroll', handleScroll);
//   }, [handleScroll]);

//   const filteredData = useMemo(() => {
//     if (!globalFilter) return data;
    
//     const filter = globalFilter.toLowerCase();
//     return data.filter((item: any) => {
//       return Object.values(item).some((value) =>
//         String(value).toLowerCase().includes(filter)
//       );
//     });
//   }, [data, globalFilter]);

//   const displayedData = useMemo(() => {
//     if (!globalFilter) return data;
//     return filteredData;
//   }, [data, filteredData, globalFilter]);

//   return (
//     <div className="space-y-4">
//       {/* Toolbar */}
//       <div className="flex items-center justify-between">
//         <div className="flex flex-1 items-center space-x-2">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//             <Input
//               placeholder={searchPlaceholder}
//               value={globalFilter ?? ''}
//               onChange={(event) => setGlobalFilter(String(event.target.value))}
//               className="w-80 pl-10"
//             />
//           </div>
//           <Badge variant="secondary" className="ml-auto">
//             {displayedData.length} item(s)
//           </Badge>
//         </div>
//         <div className="flex items-center space-x-2">
//           {onRefresh && (
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={onRefresh}
//               disabled={isLoading}
//             >
//               <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
//               Refresh
//             </Button>
//           )}
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="outline" size="sm">
//                 <Settings2 className="h-4 w-4" />
//                 View
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="w-48">
//               {table
//                 .getAllColumns()
//                 .filter((column) => column.getCanHide())
//                 .map((column) => {
//                   return (
//                     <DropdownMenuCheckboxItem
//                       key={column.id}
//                       className="capitalize"
//                       checked={column.getIsVisible()}
//                       onCheckedChange={(value) => column.toggleVisibility(!!value)}
//                     >
//                       {column.id}
//                     </DropdownMenuCheckboxItem>
//                   );
//                 })}
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </div>

//       {/* Table */}
//       <div 
//         ref={tableContainerRef}
//         className="rounded-md border max-h-[600px] overflow-auto"
//       >
//         <Table>
//           <TableHeader className="sticky top-0 bg-background">
//             {table.getHeaderGroups().map((headerGroup) => (
//               <TableRow key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => {
//                   return (
//                     <TableHead key={header.id}>
//                       {header.isPlaceholder
//                         ? null
//                         : flexRender(
//                             header.column.columnDef.header,
//                             header.getContext()
//                           )}
//                     </TableHead>
//                   );
//                 })}
//               </TableRow>
//             ))}
//           </TableHeader>
//           <TableBody>
//             {table.getRowModel().rows?.length ? (
//               <>
//                 {table.getRowModel().rows.map((row) => (
//                   <TableRow
//                     key={row.id}
//                     data-state={row.getIsSelected() && 'selected'}
//                   >
//                     {row.getVisibleCells().map((cell) => (
//                       <TableCell key={cell.id}>
//                         {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                       </TableCell>
//                     ))}
//                   </TableRow>
//                 ))}
//                 {/* Loading indicator for infinite scroll */}
//                 {isFetchingNextPage && (
//                   <TableRow>
//                     <TableCell colSpan={columns.length} className="h-24 text-center">
//                       <div className="flex items-center justify-center space-x-2">
//                         <RefreshCw className="h-4 w-4 animate-spin" />
//                         <span>Loading more...</span>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 )}
//                 {/* End of data indicator */}
//                 {!hasNextPage && data.length > 0 && (
//                   <TableRow>
//                     <TableCell colSpan={columns.length} className="h-12 text-center text-muted-foreground text-sm">
//                       No more data to load
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </>
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={columns.length} className="h-24 text-center">
//                   {isLoading ? (
//                     <div className="flex items-center justify-center space-x-2">
//                       <RefreshCw className="h-4 w-4 animate-spin" />
//                       <span>Loading...</span>
//                     </div>
//                   ) : (
//                     'No results.'
//                   )}
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   );
// }