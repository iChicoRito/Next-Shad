'use client';

// UsersPage - main users management page
import { useState, useMemo } from 'react';
import { StatCards } from './components/users-stats-cards';
import { DataTable } from './components/view-users-table-';
import initialUsersData from './data.json';

// ==================== TYPES ====================
interface User {
  id: number;
  surname: string;
  givenName: string;
  email: string;
  status: string;
  role: string;
  joinedDate: string;
  lastLogin: string;
}

interface UserFormValues {
  surname: string;
  givenName: string;
  email: string;
  password: string;
  confirmPassword: string;
  status: string;
  role: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsersData);

  // ==================== STATS CALCULATIONS ====================
  // calculate stats from users data
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.status === 'Active').length;
    const pendingUsers = users.filter((u) => u.status === 'Pending').length;
    const inactiveUsers = users.filter((u) => u.status === 'Inactive').length;
    const errorUsers = users.filter((u) => u.status === 'Error').length;

    return {
      totalUsers,
      activeUsers,
      pendingUsers,
      inactiveUsers,
      errorUsers,
    };
  }, [users]);

  // ==================== HANDLE ADD USER ====================
  const handleAddUser = (userData: UserFormValues) => {
    const newUser: User = {
      id: Math.max(...users.map((u) => u.id), 0) + 1,
      surname: userData.surname,
      givenName: userData.givenName,
      email: userData.email,
      status: userData.status,
      role: userData.role,
      joinedDate: new Date().toISOString().split('T')[0],
      lastLogin: new Date().toISOString().split('T')[0],
    };
    setUsers((prev) => [newUser, ...prev]);
  };

  // ==================== HANDLE DELETE USER ====================
  const handleDeleteUser = (id: number) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  // ==================== HANDLE EDIT USER ====================
  const handleEditUser = (user: User) => {
    // TODO: implement edit functionality
    console.log('Edit user:', user);
  };

  // ==================== RENDER ====================
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
        <DataTable users={users} onDeleteUser={handleDeleteUser} onEditUser={handleEditUser} onAddUser={handleAddUser} />
      </div>
    </div>
  );
}
