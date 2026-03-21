'use client';

import { useState } from 'react';
import { type ColumnDef, type ColumnFiltersState, type SortingState, type VisibilityState, type Row, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { ChevronDown, EllipsisVertical, Download, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RoleFormDialog } from './role-form-dialog';

interface Role {
  id: number;
  roleName: string;
  description: string;
  status: string;
  createdAt: string;
}

interface RoleFormValues {
  roleName: string;
  description: string;
  status: string;
}

interface DataTableProps {
  roles: Role[];
  onDeleteRole: (id: number) => void;
  onEditRole: (role: Role) => void;
  onAddRole: (roleData: RoleFormValues) => void;
}

export function DataTable({ roles, onDeleteRole, onEditRole, onAddRole }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20';
      case 'Inactive':
        return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20';
      case 'Pending':
        return 'text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900/20';
      default:
        return 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  const exactFilter = (row: Row<Role>, columnId: string, value: string) => {
    return row.getValue(columnId) === value;
  };

  const columns: ColumnDef<Role>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <div className='flex items-center justify-center px-2'>
          <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')} onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)} aria-label='Select all' />
        </div>
      ),
      cell: ({ row }) => (
        <div className='flex items-center justify-center px-2'>
          <Checkbox checked={row.getIsSelected()} onCheckedChange={value => row.toggleSelected(!!value)} aria-label='Select row' />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
      size: 50,
    },
    {
      accessorKey: 'roleName',
      header: 'Role Name',
      cell: ({ row }) => {
        const roleName = row.getValue('roleName') as string;
        return <span className='font-medium'>{roleName}</span>;
      },
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => {
        const description = row.getValue('description') as string;
        return <span className='text-sm'>{description}</span>;
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return (
          <Badge variant='secondary' className={getStatusColor(status)}>
            {status}
          </Badge>
        );
      },
      filterFn: exactFilter,
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ row }) => {
        const date = row.getValue('createdAt') as string;
        return <span className='text-sm'>{date}</span>;
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const role = row.original;
        return (
          <div className='flex items-center'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='icon' className='h-8 w-8 cursor-pointer'>
                  <EllipsisVertical className='size-4' />
                  <span className='sr-only'>More actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem className='cursor-pointer' onClick={() => onEditRole(role)}>
                  Edit Role
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant='destructive' className='cursor-pointer' onClick={() => onDeleteRole(role.id)}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: roles,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  const statusFilter = table.getColumn('status')?.getFilterValue() as string;

  return (
    <div className='w-full space-y-4'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex flex-1 items-center space-x-2'>
          <div className='relative flex-1 max-w-sm'>
            <Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
            <Input placeholder='Search roles...' value={globalFilter ?? ''} onChange={event => setGlobalFilter(String(event.target.value))} className='pl-9' />
          </div>
        </div>
        <div className='flex items-center space-x-2'>
          <Button variant='outline' className='cursor-pointer'>
            <Download className='mr-2 size-4' />
            Export
          </Button>
          <RoleFormDialog onAddRole={onAddRole} />
        </div>
      </div>

      <div className='grid gap-2 sm:grid-cols-2 sm:gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='status-filter' className='text-sm font-medium'>
            Status
          </Label>
          <Select value={statusFilter || ''} onValueChange={value => table.getColumn('status')?.setFilterValue(value === 'all' ? '' : value)}>
            <SelectTrigger className='cursor-pointer w-full' id='status-filter'>
              <SelectValue placeholder='Select Status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Status</SelectItem>
              <SelectItem value='Active'>Active</SelectItem>
              <SelectItem value='Inactive'>Inactive</SelectItem>
              <SelectItem value='Pending'>Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className='space-y-2'>
          <Label htmlFor='column-visibility' className='text-sm font-medium'>
            Column Visibility
          </Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild id='column-visibility'>
              <Button variant='outline' className='cursor-pointer w-full'>
                Columns <ChevronDown className='ml-2 size-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              {table
                .getAllColumns()
                .filter(column => column.getCanHide())
                .map(column => {
                  return (
                    <DropdownMenuCheckboxItem key={column.id} className='capitalize' checked={column.getIsVisible()} onCheckedChange={value => column.toggleVisibility(!!value)}>
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>;
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className='flex items-center justify-between space-x-2 py-4'>
        <div className='flex items-center space-x-2'>
          <Label htmlFor='page-size' className='text-sm font-medium'>
            Show
          </Label>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={value => {
              table.setPageSize(Number(value));
            }}>
            <SelectTrigger className='w-20 cursor-pointer' id='page-size'>
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side='top'>
              {[10, 20, 30, 40, 50].map(pageSize => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='flex-1 text-sm text-muted-foreground hidden sm:block'>
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className='flex items-center space-x-6 lg:space-x-8'>
          <div className='flex items-center space-x-2 hidden sm:block'>
            <p className='text-sm font-medium'>Page</p>
            <strong className='text-sm'>
              {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </strong>
          </div>
          <div className='flex items-center space-x-2'>
            <Button variant='outline' size='sm' onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className='cursor-pointer'>
              Previous
            </Button>
            <Button variant='outline' size='sm' onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className='cursor-pointer'>
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
