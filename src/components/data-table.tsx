import * as React from 'react';
import { useMemo } from 'react';

import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from '@tabler/icons-react';


import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { z } from 'zod';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useOrders } from '@/contexts/OrdersContext';

export const schema = z.object({
  id: z.number(),
  header: z.string(),
  type: z.string(),
  status: z.string(),
  target: z.string(),
  limit: z.string(),
  reviewer: z.string(),
});

export function DataTable() {
  const { orders, isLoaded } = useOrders();

  const bestSelling = useMemo(() => {
    const map = new Map<
      string,
      { title: string; sold: number; sales: number; paymentType: string }
    >();
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const entry = map.get(item.beatId) || {
          title: item.title,
          sold: 0,
          sales: 0,
          paymentType: '',
        };
        entry.sold += 1;
        entry.sales += item.price;
        entry.paymentType = order.paymentType;

        map.set(item.beatId, entry);
      });
    });
    return Array.from(map.entries())
      .map(([beatId, data]) => ({ beatId, ...data }))
      .sort((a, b) => b.sold - a.sold);
  }, [orders]);

  // State for orders table

  const [orderRowSelection, setOrderRowSelection] = React.useState({});
  const [orderGlobalFilter, setOrderGlobalFilter] = React.useState('');

  // State for best-selling table

  const [bestRowSelection, setBestRowSelection] = React.useState({});
  const [bestGlobalFilter, setBestGlobalFilter] = React.useState('');

  // Orders table
  const orderColumns = [
    {
      accessorKey: 'orderId',
      header: 'ID',
      cell: ({ row }: { row: any }) => (
        <div>#{row.original.orderId.slice(0, 7)}...</div>
      ),
    },
    {
      id: 'customer',
      accessorKey: 'customerInfo.name', // Use a string accessor key for the nested data
      header: 'Customer',
      cell: ({ row }: { row: any }) => (
        <div className="flex items-center gap-2">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
              row.original.customerInfo.name
            )}&background=random`}
            alt={row.original.customerInfo.name}
            className="h-6 w-6 rounded-full"
          />
          {row.original.customerInfo.name}
        </div>
      ),
    },
    {
      accessorKey: 'totalPrice',
      header: 'Amount',
      cell: ({ row }: { row: any }) => `$${row.original.totalPrice.toFixed(2)}`,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: { row: any }) => {
        let variant: 'default' | 'secondary' | 'destructive' | 'outline' =
          'default';
        if (row.original.paymentType === 'PayPal') variant = 'secondary';
        if (row.original.paymentType === 'Stripe') variant = 'outline';
        return <Badge variant={variant}>{row.original.paymentType}</Badge>;
      },
    },
    {
      accessorKey: 'paymentType',
      header: 'Type',
      cell: ({ row }: { row: any }) => {
        let variant: 'default' | 'secondary' | 'destructive' | 'outline' =
          'default';
        if (row.original.paymentType === 'PayPal') variant = 'secondary';
        if (row.original.paymentType === 'Stripe') variant = 'outline';

        return <Badge variant={variant}>{row.original.paymentType} </Badge>;
      },
    },
  ];

  // Best-selling table
  const bestColumns = [
    // {
    //   id: 'select',
    //   header: ({ table }) => (
    //     <Checkbox
    //       checked={
    //         table.getIsAllPageRowsSelected() ||
    //         (table.getIsSomePageRowsSelected() && 'indeterminate')
    //       }
    //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //       aria-label="Select all"
    //     />
    //   ),
    //   cell: ({ row }) => (
    //     <Checkbox
    //       checked={row.getIsSelected()}
    //       onCheckedChange={(value) => row.toggleSelected(!!value)}
    //       aria-label="Select row"
    //     />
    //   ),
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    {
      id: 'product',
      accessorKey: 'title',
      header: 'Product',
      cell: ({ row }: { row: any }) => {
        return (
          <div className="flex items-center gap-2">
            <img
              src={
                row.original.image ||
                'https://ui-avatars.com/api/?name=Product&background=random'
              }
              alt={row.original.title}
              className="h-10 w-10 object-cover !rounded-md"
            />
            {row.original.title}
          </div>
        );
      },
    },
    {
      accessorKey: 'sold',
      header: 'Sold',
    },
    {
      accessorKey: 'sales',
      header: 'Sales',
      cell: ({ row }: { row: any }) => `$${row.original.sales.toFixed(2)}`,
    },
  ];

  // Order table
  const orderTable = useReactTable({
    data: orders,
    columns: orderColumns,
    onRowSelectionChange: setOrderRowSelection,
    onGlobalFilterChange: setOrderGlobalFilter,
    globalFilterFn: 'includesString',
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      rowSelection: orderRowSelection,
      globalFilter: orderGlobalFilter,
    },
  });

  // Best-selling table
  const bestTable = useReactTable({
    data: bestSelling,
    columns: bestColumns,
    onRowSelectionChange: setBestRowSelection,
    onGlobalFilterChange: setBestGlobalFilter,
    globalFilterFn: 'includesString',
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(), // Optional; remove if no pagination needed for best-selling
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      rowSelection: bestRowSelection,
      globalFilter: bestGlobalFilter,
    },
  });

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
      {/* Recent Orders Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Recent Orders</h3>
        </div>
        <Input
          placeholder="Filter orders..."
          value={orderGlobalFilter ?? ''}
          onChange={(event) => setOrderGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {orderTable.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
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
              {orderTable.getRowModel().rows?.length ? (
                orderTable.getRowModel().rows.map((row) => (
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
                    colSpan={orderColumns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="text-sm text-muted-foreground">
            Showing{' '}
            {orderTable.getFilteredRowModel().rows.length > 0
              ? orderTable.getState().pagination.pageIndex *
                  orderTable.getState().pagination.pageSize +
                1
              : 0}{' '}
            to{' '}
            {Math.min(
              (orderTable.getState().pagination.pageIndex + 1) *
                orderTable.getState().pagination.pageSize,
              orderTable.getFilteredRowModel().rows.length
            )}{' '}
            of {orderTable.getFilteredRowModel().rows.length} entries
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => orderTable.firstPage()}
              disabled={!orderTable.getCanPreviousPage()}
            >
              <IconChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => orderTable.previousPage()}
              disabled={!orderTable.getCanPreviousPage()}
            >
              <IconChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => orderTable.nextPage()}
              disabled={!orderTable.getCanNextPage()}
            >
              <IconChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => orderTable.lastPage()}
              disabled={!orderTable.getCanNextPage()}
            >
              <IconChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${orderTable.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              orderTable.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue
                placeholder={orderTable.getState().pagination.pageSize}
              />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Best Selling Products Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Best Selling Products</h3>
        </div>
        <Input
          placeholder="Filter products..."
          value={bestGlobalFilter ?? ''}
          onChange={(event) => setBestGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {bestTable.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
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
              {bestTable.getRowModel().rows?.length ? (
                bestTable.getRowModel().rows.map((row) => (
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
                    colSpan={bestColumns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="text-sm text-muted-foreground">
            Showing{' '}
            {bestTable.getFilteredRowModel().rows.length > 0
              ? bestTable.getState().pagination.pageIndex *
                  bestTable.getState().pagination.pageSize +
                1
              : 0}{' '}
            to{' '}
            {Math.min(
              (bestTable.getState().pagination.pageIndex + 1) *
                bestTable.getState().pagination.pageSize,
              bestTable.getFilteredRowModel().rows.length
            )}{' '}
            of {bestTable.getFilteredRowModel().rows.length} entries
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => bestTable.firstPage()}
              disabled={!bestTable.getCanPreviousPage()}
            >
              <IconChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => bestTable.previousPage()}
              disabled={!bestTable.getCanPreviousPage()}
            >
              <IconChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => bestTable.nextPage()}
              disabled={!bestTable.getCanNextPage()}
            >
              <IconChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => bestTable.lastPage()}
              disabled={!bestTable.getCanNextPage()}
            >
              <IconChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${bestTable.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              bestTable.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue
                placeholder={bestTable.getState().pagination.pageSize}
              />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
