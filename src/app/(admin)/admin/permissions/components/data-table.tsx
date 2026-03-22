'use client';

// ==================== IMPORTS ====================
import { useState } from 'react';
import { type ColumnDef, type ColumnFiltersState, type SortingState, type VisibilityState, type Row, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { IconChevronDown, IconChevronUp, IconDotsVertical, IconDownload, IconSearch } from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PermissionFormDialog } from './create-permissions-dialog';
import { ViewPermissionDialog } from './view-permission-dialog';

// ==================== TYPES & INTERFACES ====================

// Permission data structure
interface Permission {
    // Unique identifier for the permission
    id: number;
    // Display name of the permission
    permissionName: string;
    // Detailed description of the permission
    description: string;
    // Current status (Active, Inactive, Pending)
    status: string;
    // Creation date of the permission
    createdAt: string;
}

// Form values for permission creation/editing
interface PermissionFormValues {
    // Permission display name
    permissionName: string;
    // Permission description
    description: string;
    // Permission status
    status: string;
}

// Props for DataTable component
interface DataTableProps {
    // Array of permissions to display
    permissions: Permission[];
    // Callback function to delete a permission
    onDeletePermission: (id: number) => void;
    // Callback function to edit a permission
    onEditPermission: (permission: Permission) => void;
    // Callback function to add a new permission
    onAddPermission: (permissionData: PermissionFormValues) => void;
}

// ==================== HELPER FUNCTIONS ====================

// Returns appropriate Tailwind classes based on permission status
const getStatusColor = (status: string): string => {
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

// Exact filter function for status column
const exactFilter = (row: Row<Permission>, columnId: string, value: string): boolean => {
    return row.getValue(columnId) === value;
};

// ==================== COMPONENT ====================

// DataTable - Main table component for displaying and managing permissions
export function DataTable({ permissions, onDeletePermission, onEditPermission, onAddPermission }: DataTableProps) {
    // ==================== STATE MANAGEMENT ====================

    // Sorting state for table columns
    const [sorting, setSorting] = useState<SortingState>([]);

    // Column filter state
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    // Column visibility state
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

    // Row selection state
    const [rowSelection, setRowSelection] = useState({});

    // Global search filter value
    const [globalFilter, setGlobalFilter] = useState('');

    // View dialog open state
    const [viewDialogOpen, setViewDialogOpen] = useState(false);

    // Currently selected permission for viewing
    const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);

    // ==================== COLUMN DEFINITIONS ====================

    // Table column definitions
    const columns: ColumnDef<Permission>[] = [
        // Selection column (checkbox)
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

        // Permission Name column
        {
            accessorKey: 'permissionName',
            header: ({ column }) => {
                return (
                    <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className='-ml-4 h-8 hover:bg-transparent'>
                        Permission Name
                        {column.getIsSorted() === 'asc' && <IconChevronUp size={16} className='ml-2' />}
                        {column.getIsSorted() === 'desc' && <IconChevronDown size={16} className='ml-2' />}
                        {!column.getIsSorted() && <IconChevronDown size={16} className='ml-2 opacity-50' />}
                    </Button>
                );
            },
            cell: ({ row }) => {
                const permissionName = row.getValue('permissionName') as string;
                return <span className='font-medium'>{permissionName}</span>;
            },
        },

        // Description column
        {
            accessorKey: 'description',
            header: ({ column }) => {
                return (
                    <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className='-ml-4 h-8 hover:bg-transparent'>
                        Description
                        {column.getIsSorted() === 'asc' && <IconChevronUp size={16} className='ml-2' />}
                        {column.getIsSorted() === 'desc' && <IconChevronDown size={16} className='ml-2' />}
                        {!column.getIsSorted() && <IconChevronDown size={16} className='ml-2 opacity-50' />}
                    </Button>
                );
            },
            cell: ({ row }) => {
                const description = row.getValue('description') as string;
                return <span className='text-sm'>{description}</span>;
            },
        },

        // Status column
        {
            accessorKey: 'status',
            header: ({ column }) => {
                return (
                    <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className='-ml-4 h-8 hover:bg-transparent'>
                        Status
                        {column.getIsSorted() === 'asc' && <IconChevronUp size={16} className='ml-2' />}
                        {column.getIsSorted() === 'desc' && <IconChevronDown size={16} className='ml-2' />}
                        {!column.getIsSorted() && <IconChevronDown size={16} className='ml-2 opacity-50' />}
                    </Button>
                );
            },
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

        // Created At column
        {
            accessorKey: 'createdAt',
            header: ({ column }) => {
                return (
                    <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className='-ml-4 h-8 hover:bg-transparent'>
                        Created At
                        {column.getIsSorted() === 'asc' && <IconChevronUp size={16} className='ml-2' />}
                        {column.getIsSorted() === 'desc' && <IconChevronDown size={16} className='ml-2' />}
                        {!column.getIsSorted() && <IconChevronDown size={16} className='ml-2 opacity-50' />}
                    </Button>
                );
            },
            cell: ({ row }) => {
                const date = row.getValue('createdAt') as string;
                return <span className='text-sm'>{date}</span>;
            },
        },

        // Actions column (dropdown menu)
        {
            id: 'actions',
            header: '',
            cell: ({ row }) => {
                const permission = row.original;
                return (
                    <div className='flex items-center'>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant='ghost' size='icon' className='h-8 w-8 cursor-pointer'>
                                    <IconDotsVertical size={16} />
                                    <span className='sr-only'>More actions</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                                <DropdownMenuItem
                                    className='cursor-pointer'
                                    onClick={() => {
                                        setSelectedPermission(permission);
                                        setViewDialogOpen(true);
                                    }}>
                                    View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem className='cursor-pointer' onClick={() => onEditPermission(permission)}>
                                    Edit Permission
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem variant='destructive' className='cursor-pointer' onClick={() => onDeletePermission(permission.id)}>
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
        },
    ];

    // ==================== TABLE INSTANCE ====================

    // Create table instance with all configurations
    const table = useReactTable({
        data: permissions,
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

    // Get current status filter value
    const statusFilter = table.getColumn('status')?.getFilterValue() as string;

    // ==================== RENDER ====================

    return (
        <div className='w-full space-y-4'>
            {/* ==================== TOOLBAR ==================== */}
            <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                {/* Search Input */}
                <div className='flex flex-1 items-center space-x-2'>
                    <div className='relative flex-1 max-w-sm'>
                        <IconSearch size={16} className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground' />
                        <Input placeholder='Search permissions...' value={globalFilter ?? ''} onChange={event => setGlobalFilter(String(event.target.value))} className='pl-9' />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className='flex items-center space-x-2'>
                    <Button variant='outline' className='cursor-pointer gap-2'>
                        <IconDownload size={16} />
                        Export
                    </Button>
                    <PermissionFormDialog onAddPermission={onAddPermission} />
                </div>
            </div>

            {/* ==================== FILTERS ==================== */}
            <div className='grid gap-2 sm:grid-cols-2 sm:gap-4'>
                {/* Status Filter Dropdown */}
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

                {/* Column Visibility Dropdown */}
                <div className='space-y-2'>
                    <Label htmlFor='column-visibility' className='text-sm font-medium'>
                        Column Visibility
                    </Label>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild id='column-visibility'>
                            <Button variant='outline' className='cursor-pointer w-full'>
                                Columns <IconChevronDown size={16} className='ml-2' />
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

            {/* ==================== TABLE ==================== */}
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

            {/* ==================== PAGINATION ==================== */}
            <div className='flex items-center justify-between space-x-2 py-4'>
                {/* Page Size Selector */}
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

                {/* Selected Rows Info */}
                <div className='flex-1 text-sm text-muted-foreground hidden sm:block'>
                    {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>

                {/* Pagination Controls */}
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

            {/* View Permission Dialog */}
            <ViewPermissionDialog permission={selectedPermission} open={viewDialogOpen} onOpenChange={setViewDialogOpen} />
        </div>
    );
}
