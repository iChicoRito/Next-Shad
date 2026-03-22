'use client';
import { useState, useMemo } from 'react';
import { DataTable } from './components/data-table';
import initialRolesData from './data.json';

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

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>(
    initialRolesData.map(({ id, roleName, description, status, createdAt }) => ({
      id,
      roleName,
      description,
      status,
      createdAt,
    }))
  );
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
  const handleAddRole = (roleData: RoleFormValues) => {
    const newId = Math.max(...roles.map((r) => r.id)) + 1;
    const newRole: Role = {
      id: newId,
      roleName: roleData.roleName,
      description: roleData.description,
      status: roleData.status,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setRoles((prev) => [newRole, ...prev]);
  };
  const handleDeleteRole = (id: number) => {
    setRoles((prev) => prev.filter((role) => role.id !== id));
  };
  const handleEditRole = (role: Role) => {
    console.log('Edit role:', role);
  };
  return (
    <div className="flex flex-col gap-4">
      {}
      <div className="@container/main px-4 lg:px-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Role-Based Access Control</h1>
          <p className="text-muted-foreground">
            Build a secure system with structured role management.
          </p>
        </div>
      </div>
      {}
      <div className="@container/main px-4 lg:px-6 mt-8 lg:mt-12">
        <DataTable
          roles={roles}
          onDeleteRole={handleDeleteRole}
          onEditRole={handleEditRole}
          onAddRole={handleAddRole}
        />
      </div>
    </div>
  );
}
