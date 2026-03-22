'use client';
import { useState, useEffect, useMemo } from 'react';
import { DataTable } from './components/data-table';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

// Role interface
interface Role {
  id: number;
  roleName: string;
  description: string;
  status: string;
  createdAt: string;
}

// Role form values interface
interface RoleFormValues {
  roleName: string;
  description: string;
  status: string;
}

export default function RolesPage() {
  // ==================== STATE ====================
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  // ==================== FETCH ROLES ====================
  const fetchRoles = async () => {
    try {
      setLoading(true);
      const supabase = createClient();

      // Fetch roles from database
      const { data, error } = await supabase.from('tbl_roles').select('id, role_name, description, status, created_at').order('created_at', { ascending: false });

      if (error) throw error;

      // Map database fields to frontend fields
      const mappedRoles: Role[] = data.map((item: any) => ({
        id: item.id,
        roleName: item.role_name,
        description: item.description,
        status: item.status,
        createdAt: new Date(item.created_at).toISOString().split('T')[0],
      }));

      setRoles(mappedRoles);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch roles');
    } finally {
      setLoading(false);
    }
  };

  // ==================== SETUP REALTIME SUBSCRIPTION ====================
  useEffect(() => {
    // Initial fetch
    fetchRoles();

    // Create Supabase client
    const supabase = createClient();

    // Subscribe to real-time changes on tbl_roles
    const channel = supabase
      .channel('tbl_roles_changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'tbl_roles',
        },
        () => {
          // Refetch roles when any change occurs
          fetchRoles();
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
    const totalRoles = roles.length;
    const activeRoles = roles.filter((role) => role.status === 'Active').length;
    const inactiveRoles = roles.filter((role) => role.status === 'Inactive').length;
    return {
      totalRoles,
      activeRoles,
      inactiveRoles,
    };
  }, [roles]);

  // ==================== CRUD HANDLERS ====================
  const handleAddRole = () => {
    fetchRoles(); // Refresh data after adding
  };

  const handleDeleteRole = async (id: number) => {
    try {
      const supabase = createClient();

      // Delete role from database
      const { error } = await supabase.from('tbl_roles').delete().eq('id', id);

      if (error) throw error;

      toast.success('Role deleted successfully!');
      // No need to call fetchRoles - real-time will handle it
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete role');
    }
  };

  const handleEditRole = (role: Role) => {
    // Will be implemented in next objective
    console.log('Edit role:', role);
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
          <h1 className="text-2xl font-bold tracking-tight">Role-Based Access Control</h1>
          <p className="text-muted-foreground">Build a secure system with structured role management.</p>
        </div>
      </div>

      {/* data table section */}
      <div className="@container/main px-4 lg:px-6 mt-4 lg:mt-6">
        <DataTable roles={roles} onDeleteRole={handleDeleteRole} onEditRole={handleEditRole} onAddRole={handleAddRole} />
      </div>
    </div>
  );
}
