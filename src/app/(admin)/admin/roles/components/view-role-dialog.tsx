'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IconClock, IconLock, IconShield, IconList } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface Role {
  id: number;
  roleName: string;
  description: string;
  status: string;
  createdAt: string;
}

interface Permission {
  id: number;
  permissionName: string;
  description: string;
  status: string;
}

interface ViewRoleDialogProps {
  role: Role | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// getStatusColor - returns status badge color classes
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

// getPermissionStatusColor - returns permission status badge color classes
const getPermissionStatusColor = (status: string): string => {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    case 'Inactive':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
  }
};

export function ViewRoleDialog({ role, open, onOpenChange }: ViewRoleDialogProps) {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);

  // ==================== FETCH PERMISSIONS ====================
  useEffect(() => {
    const fetchPermissions = async () => {
      if (!role || !open) return;

      setLoading(true);
      try {
        const supabase = createClient();

        // Fetch permissions assigned to this role using junction table
        const { data, error } = await supabase
          .from('tbl_role_permissions')
          .select(
            `
            permission_id,
            tbl_permission (
              id,
              permission_name,
              description,
              status
            )
          `
          )
          .eq('roles_id', role.id);

        if (error) throw error;

        // Map database fields to frontend fields
        const mappedPermissions: Permission[] = (data || []).map((item: any) => ({
          id: item.tbl_permission.id,
          permissionName: item.tbl_permission.permission_name,
          description: item.tbl_permission.description || '',
          status: item.tbl_permission.status,
        }));

        setPermissions(mappedPermissions);
      } catch (error: any) {
        console.error('Failed to fetch permissions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [role, open]);

  if (!role) return null;

  // ==================== HANDLE CLOSE ====================
  const handleClose = () => {
    onOpenChange(false);
    // Reset permissions when dialog closes
    setTimeout(() => setPermissions([]), 200);
  };

  // ==================== RENDER ====================
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl p-0 gap-0 max-h-[90vh] overflow-y-auto">
        {/* header */}
        <DialogHeader className="p-6 pb-4 border-b sticky top-0 bg-background z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <DialogTitle className="text-xl font-semibold tracking-tight">{role.roleName}</DialogTitle>
                <DialogDescription className="text-xs mt-0.5">Role Information & Permissions</DialogDescription>
              </div>
            </div>
            {/* status badge */}
            <Badge className={cn('px-3 py-1 text-xs font-medium border', getStatusColor(role.status))}>{role.status}</Badge>
          </div>
        </DialogHeader>

        {/* content */}
        <div className="p-6 space-y-6">
          {/* description section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">Description</p>
            </div>
            <p className="text-sm text-muted-foreground">{role.description}</p>
          </div>

          {/* permissions section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">Assigned Permissions</p>
              <Badge variant="secondary" className="ml-2">
                {permissions.length}
              </Badge>
            </div>

            {/* permissions list */}
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : permissions.length > 0 ? (
              <div className="space-y-2">
                {permissions.map((permission) => (
                  <div key={permission.id} className="flex items-start justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <IconShield size={14} className="text-muted-foreground" />
                        <p className="text-sm font-medium">{permission.permissionName}</p>
                      </div>
                      {permission.description && <p className="text-xs text-muted-foreground">{permission.description}</p>}
                    </div>
                    <Badge className={cn('ml-2 text-xs', getPermissionStatusColor(permission.status))}>{permission.status}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center rounded-lg border border-dashed bg-muted/20">
                <IconList size={24} className="mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No permissions assigned to this role</p>
                <p className="text-xs text-muted-foreground mt-1">Add permissions in the Permissions page</p>
              </div>
            )}
          </div>

          {/* info box */}
          <div className="flex items-start gap-2.5 p-3 bg-yellow-50/50 dark:bg-yellow-950/20 rounded-lg border border-yellow-100 dark:border-yellow-900">
            <IconClock size={16} className="text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-yellow-700 dark:text-yellow-400">Role Management</p>
              <p className="text-xs text-muted-foreground mt-0.5">Manage permissions and user assignments in the edit section.</p>
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="px-6 py-4 border-t bg-muted/30 flex justify-end sticky bottom-0">
          <Button variant="outline" onClick={handleClose} className="cursor-pointer">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
