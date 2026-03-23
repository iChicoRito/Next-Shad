'use client';

// UsersPage - main users management page with Supabase real-time
import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { StatCards } from './components/users-stats-cards';
import { DataTable } from './components/view-users-table';
import { createClient } from '@/lib/supabase/client';

// ==================== TYPES ====================
interface User {
  id: string;
  surname: string;
  given_name: string;
  email: string;
  status: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export default function UsersPage() {
  // ==================== STATE ====================
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  // ==================== FETCH USERS ====================
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.from('tbl_users').select('*').order('created_at', { ascending: false });

      if (error) throw error;

      setUsers(data || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch users');
      console.error('Fetch users error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== REAL-TIME SUBSCRIPTION ====================
  useEffect(() => {
    // Initial fetch
    fetchUsers();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('tbl_users_changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'tbl_users',
        },
        (payload) => {
          console.log('Real-time change:', payload);

          // Handle different events
          if (payload.eventType === 'INSERT') {
            // Add new user to list (admin policy kept for future)
            setUsers((prev) => [payload.new as User, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            // Update existing user
            setUsers((prev) => prev.map((user) => (user.id === payload.new.id ? (payload.new as User) : user)));
            toast.info('User updated');
          } else if (payload.eventType === 'DELETE') {
            // Remove deleted user
            setUsers((prev) => prev.filter((user) => user.id !== payload.old.id));
            toast.info('User deleted');
          }
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ==================== STATS CALCULATIONS ====================
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.status === 'active').length;
    const pendingUsers = users.filter((u) => u.status === 'pending').length;
    const inactiveUsers = users.filter((u) => u.status === 'inactive').length;

    return {
      totalUsers,
      activeUsers,
      pendingUsers,
      inactiveUsers,
    };
  }, [users]);

  // ==================== HANDLE DELETE USER ====================
  const handleDeleteUser = async (id: string) => {
    try {
      // Get user email for toast message
      const userToDelete = users.find((u) => u.id === id);

      // Call database function to delete user
      const { error } = await supabase.rpc('delete_user', { user_id: id });

      if (error) throw error;

      toast.success(`User ${userToDelete?.email || ''} deleted successfully`);
      // No need to call fetchUsers() - real-time will handle it
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete user');
      console.error('Delete user error:', error);
    }
  };

  // ==================== HANDLE EDIT USER ====================
  const handleEditUser = async (user: User) => {
    // TODO: implement edit functionality
    toast.info('Edit functionality coming soon');
    console.log('Edit user:', user);
  };

  // ==================== RENDER ====================
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="@container/main px-4 lg:px-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Manage Users</h1>
            <p className="text-muted-foreground">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="@container/main px-4 lg:px-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Manage Users</h1>
          <p className="text-muted-foreground">View and manage all user accounts in the system.</p>
        </div>
      </div>

      <div className="@container/main px-4 lg:px-6">
        <StatCards totalUsers={stats.totalUsers} activeUsers={stats.activeUsers} pendingUsers={stats.pendingUsers} inactiveUsers={stats.inactiveUsers} />
      </div>

      <div className="@container/main px-4 lg:px-6 mt-6 lg:mt-6">
        <DataTable users={users} onDeleteUser={handleDeleteUser} onEditUser={handleEditUser} />
      </div>
    </div>
  );
}
