'use client';

// ==================== IMPORTS ====================
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IconLock, IconShield } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

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

// Props for ViewPermissionDialog component
interface ViewPermissionDialogProps {
    // Permission data to display, null when no permission selected
    permission: Permission | null;
    // Controls dialog visibility
    open: boolean;
    // Callback to handle dialog open/close state change
    onOpenChange: (open: boolean) => void;
}

// ==================== HELPER FUNCTIONS ====================

// Returns appropriate Tailwind classes based on permission status
const getStatusColor = (status: string): string => {
    switch (status) {
        case 'Active':
            return 'bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400 border-green-200 dark:border-green-800';
        case 'Inactive':
            return 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border-red-200 dark:border-red-800';
        case 'Pending':
            return 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
        default:
            return 'bg-gray-50 text-gray-700 dark:bg-gray-900/40 dark:text-gray-400 border-gray-200 dark:border-gray-800';
    }
};

// ==================== COMPONENT ====================

// ViewPermissionDialog - Modal dialog for viewing permission details
export function ViewPermissionDialog({ permission, open, onOpenChange }: ViewPermissionDialogProps) {
    // Early return if no permission data is provided
    if (!permission) return null;

    // ==================== EVENT HANDLERS ====================

    // Handle dialog close action
    // Closes the modal by updating parent state
    const handleClose = () => {
        onOpenChange(false);
    };

    // ==================== RENDER ====================

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='sm:max-w-lg p-0 gap-0'>
                {/* ==================== DIALOG HEADER ==================== */}
                <DialogHeader className='p-6 pb-4 border-b'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                            <div>
                                <DialogTitle className='text-xl font-semibold tracking-tight'>{permission.permissionName}</DialogTitle>
                                <DialogDescription className='text-xs mt-0.5'>Permission Information</DialogDescription>
                            </div>
                        </div>
                        {/* Status badge with dynamic styling */}
                        <Badge className={cn('px-3 py-1 text-xs font-medium border', getStatusColor(permission.status))}>{permission.status}</Badge>
                    </div>
                </DialogHeader>

                {/* ==================== DIALOG BODY ==================== */}
                <div className='p-6 space-y-5'>
                    {/* Description Section */}
                    <div className='space-y-2'>
                        <div className='flex items-center gap-2'>
                            <p className='text-sm font-medium'>Description</p>
                        </div>
                        <p className='text-sm text-muted-foreground'>{permission.description}</p>
                    </div>

                    {/* Informational Note Section */}
                    <div className='flex items-start gap-2.5 p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-lg border border-blue-100 dark:border-blue-900'>
                        <IconLock size={16} className='text-blue-600 dark:text-blue-400 mt-0.5' />
                        <div>
                            <p className='text-xs font-medium text-blue-700 dark:text-blue-400'>Permission Usage</p>
                            <p className='text-xs text-muted-foreground mt-0.5'>This permission can be assigned to roles to control access to specific features.</p>
                        </div>
                    </div>
                </div>

                {/* ==================== DIALOG FOOTER ==================== */}
                <div className='px-6 py-4 border-t bg-muted/30 flex justify-end'>
                    <Button variant='outline' onClick={handleClose} className='cursor-pointer'>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
