import { useEffect, useState } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import type { FormEvent } from 'react';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useBeats } from '@/contexts/BeatsContext';
import { Input } from '@/components/ui/input';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

import { Skeleton } from '@/components/ui/skeleton';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'; // Assuming this is your custom component.
import { format } from 'date-fns';
const AdminBeats = () => {
  document.title = `Birdie Bands | Admin Beats`;
  const { beats, isBeatsLoaded, fetchBeats, totalPages, currentPage } =
    useBeats();

  const [globalFilter, setGlobalFilter] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [limit, setLimit] = useState(10);
  const [isFetching, setIsFetching] = useState(false);

  // Handle pagination and search. We'll use useCallback to prevent re-creation.
  //   const fetchData = useCallback(async () => {
  //     // You can modify fetchBeats to accept a page, limit, and search query.
  //     await fetchBeats(currentPage, 500, globalFilter);
  //   }, [fetchBeats, currentPage, globalFilter]);

  // Handle pagination and search
  useEffect(() => {
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || '';
    const fetchData = async () => {
      setIsFetching(true);
      await fetchBeats(page, limit, search);
      setIsFetching(false);
    };
    fetchData();
  }, [searchParams, fetchBeats, limit]);

  useEffect(() => {
    if (globalFilter.length <= 0) {
      searchParams.delete('search');
      setSearchParams(searchParams); // ✅ This updates the URL
    }
  }, [globalFilter, searchParams, setSearchParams]);

  const handlePageChange = (newPage: number) => {
    // setCurrentPage(newPage);
    setSearchParams({ page: newPage.toString() });
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = formData.get('search') as string;
    console.log('query', query);
    setSearchParams({ search: query, page: '1' });
  };

  const columns = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }: { row: any }) => {
        return (
          <div className="flex items-center gap-8">
            <img
              src={`${row.original.s3_image_url}`}
              alt={row.original.artist}
              loading="lazy"
              className="h-16 min-w-16 hover:brightness-75 transition-all duration-300 cursor-pointer rounded-sm object-cover aspect-square"
            />
            <div>
              <h2 className="font-bold text-base">{row.original.title}</h2>
              <h2 className="font-medium text-sm">
                {row.original.artist} Type Beat
              </h2>
            </div>
          </div>
        );
      },
    },
    // {
    //   accessorKey: 'artist',
    //   header: 'Artist',
    // },
    {
      accessorKey: 'bpm',
      header: 'BPM',
    },
    {
      accessorKey: 'key',
      header: 'Key',
    },
    {
      accessorKey: 'duration',
      header: 'Duration',
    },
    {
      accessorKey: 'duration',
      header: 'Duration',
    },
    {
      accessorKey: 'created_at',
      header: 'Date Uploaded',
      cell: ({ row }: { row: any }) => {
        return (
          <div>
            <p>{format(new Date(row.original.created_at), 'MMMM d, yyyy')}</p>
          </div>
        );
      },
    },
    // {
    //   accessorKey: 'licenses',
    //   header: 'Licenses',
    //   cell: ({ row }) => {
    //     const licenses = row.original.licenses;
    //     return licenses.map((l) => l.type).join(', ');
    //   },
    // },
    // {
    //   accessorKey: 'available',
    //   header: 'Available',
    //   cell: ({ row }) => (row.original.available ? 'Yes' : 'No'),
    // },
  ];

  const table = useReactTable({
    data: beats || [], // Use the beats data from the hook
    columns,
    state: {
      //   globalFilter,
    },
    // onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // Render pagination items with ellipsis and looping
  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (totalPages <= 1) {
      return (
        <PaginationItem>
          <PaginationLink
            isActive={currentPage === 1}
            onClick={() => handlePageChange(1)}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Previous button
    const isPreviousDisabled = currentPage === 1;
    items.push(
      <PaginationItem key="prev">
        <PaginationPrevious
          onClick={
            isPreviousDisabled
              ? undefined
              : () => handlePageChange(currentPage - 1)
          }
          className={isPreviousDisabled ? 'opacity-50 cursor-not-allowed' : ''}
        />
      </PaginationItem>
    );

    // First page
    if (startPage > 1) {
      items.push(
        <PaginationItem key="first">
          <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        items.push(
          <PaginationItem key="start-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    // Visible pages
    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <PaginationItem key={page}>
          <PaginationLink
            isActive={currentPage === page}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="end-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      items.push(
        <PaginationItem key="last">
          <PaginationLink onClick={() => handlePageChange(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Next button
    const isNextDisabled = currentPage === totalPages;
    items.push(
      <PaginationItem key="next">
        <PaginationNext
          onClick={
            isNextDisabled ? undefined : () => handlePageChange(currentPage + 1)
          }
          className={isNextDisabled ? 'opacity-50 cursor-not-allowed' : ''}
        />
      </PaginationItem>
    );

    return items;
  };

  const skeletonRows = Array.from({ length: 10 }).map((_, index) => (
    <TableRow key={index}>
      <TableCell>
        <Skeleton className="h-4 w-32" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-24" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-16" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-16" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-24" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-12" />
      </TableCell>
    </TableRow>
  ));

  return (
    <SidebarProvider
      className="!z-50 !relative"
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Admin Beats" />

        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-3xl font-semibold">All Beats</h3>
                  </div>
                  <form onSubmit={handleSearch}>
                    <Input
                      name="search"
                      placeholder="Filter beats..."
                      value={globalFilter ?? ''}
                      onChange={(event) => setGlobalFilter(event.target.value)}
                      className="max-w-sm"
                    />
                  </form>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
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
                        {!isBeatsLoaded && isFetching ? (
                          skeletonRows
                        ) : beats && beats.length > 0 ? (
                          table.getRowModel().rows.map((row) => (
                            <TableRow
                              key={row.id}
                              data-state={row.getIsSelected() && 'selected'}
                              onClick={() => {
                                // Navigate to the beat detail page
                                navigate(
                                  `/admin/beat?beatId=${row.original._id}`
                                );
                              }}
                              className="cursor-pointer hover:bg-zinc-800"
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
                              className="h-24 text-center"
                            >
                              No results.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  {isBeatsLoaded && totalPages > 0 && (
                    <div className="mt-8 flex justify-center">
                      <Pagination
                        data-total={totalPages}
                        data-active-page={currentPage}
                        data-loop="true"
                        data-controls={totalPages > 1 ? 'true' : 'false'}
                        className="bg-zinc-900/0 rounded-lg max-w-fit"
                      >
                        <PaginationContent>
                          {renderPaginationItems()}
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Rows per page</p>
                    <Select
                      value={`${table.getState().pagination.pageSize}`}
                      onValueChange={(value) => {
                        table.setPageSize(Number(value));
                        setLimit(Number(value));
                      }}
                    >
                      <SelectTrigger className="h-8 w-fit">
                        <SelectValue
                          placeholder={table.getState().pagination.pageSize}
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
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminBeats;
