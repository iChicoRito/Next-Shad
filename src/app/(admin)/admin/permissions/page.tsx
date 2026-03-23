'use client';

import { useState, useEffect, useMemo } from 'react';
import { DataTable } from './components/data-table';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

// Permission interface
interface Permission {
  id: number;
  roleId: number;
  roleName: string;
  permissionName: string;
  description: string;
  status: string;
  createdAt: string;
}

export default function PermissionsPage() {
  // ==================== STATE ====================
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  // ==================== FETCH PERMISSIONS ====================
  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const supabase = createClient();

      // Fetch permissions with role information
      const { data, error } = await supabase
        .from('tbl_permission')
        .select(
          `
          id,
          role_id,
          permission_name,
          description,
          status,
          created_at,
          tbl_roles (role_name)
        `
        )
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map database fields to frontend fields
      const mappedPermissions: Permission[] = data.map((item: any) => ({
        id: item.id,
        roleId: item.role_id,
        roleName: item.tbl_roles?.role_name || 'Unknown',
        permissionName: item.permission_name,
        description: item.description || '',
        status: item.status,
        createdAt: new Date(item.created_at).toISOString().split('T')[0],
      }));

      setPermissions(mappedPermissions);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch permissions');
    } finally {
      setLoading(false);
    }
  };

  // ==================== SETUP REALTIME SUBSCRIPTION ====================
  useEffect(() => {
    // Initial fetch
    fetchPermissions();

    // Create Supabase client
    const supabase = createClient();

    // Subscribe to real-time changes on tbl_permission
    const channel = supabase
      .channel('tbl_permission_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tbl_permission',
        },
        () => {
          // Refetch permissions when any change occurs
          fetchPermissions();
        }
      )
      .subscribe();

    // Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ==================== STATS ====================
  const stats = useMemo(() => {
    const totalPermissions = permissions.length;
    const activePermissions = permissions.filter((p) => p.status === 'Active').length;
    const inactivePermissions = permissions.filter((p) => p.status === 'Inactive').length;
    return {
      totalPermissions,
      activePermissions,
      inactivePermissions,
    };
  }, [permissions]);

  // ==================== CRUD HANDLERS ====================
  const handleAddPermission = () => {
    fetchPermissions(); // Refresh data after adding
  };

  const handleDeletePermission = async (id: number) => {
    try {
      const supabase = createClient();

      // Delete permission from database
      const { error } = await supabase.from('tbl_permission').delete().eq('id', id);

      if (error) throw error;

      toast.success('Permission deleted successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete permission');
    }
  };

  const handleEditPermission = (permission: Permission) => {
    // Will be implemented in future objective
    console.log('Edit permission:', permission);
  };

  // ==================== LOADING STATE ====================
  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="@container/main px-4 lg:px-6">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>
        <div className="@container/main px-4 lg:px-6 mt-4 lg:mt-6">
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // ==================== RENDER ====================
  return (
    <div className="flex flex-col gap-4">
      {/* header section */}
      <div className="@container/main px-4 lg:px-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Permission Management</h1>
          <p className="text-muted-foreground">Manage system permissions and role-based access controls.</p>
        </div>
      </div>

      {/* data table section */}
      <div className="@container/main px-4 lg:px-6 mt-4 lg:mt-6">
        <DataTable permissions={permissions} onDeletePermission={handleDeletePermission} onEditPermission={handleEditPermission} onAddPermission={handleAddPermission} />
      </div>
    </div>
  );
}
