'use client';
import { useState, useMemo } from 'react';
import { DataTable } from './components/data-table';
import initialPermissionsData from './data.json';

interface Permission {
  id: number;
  permissionName: string;
  description: string;
  status: string;
  createdAt: string;
}

interface PermissionFormValues {
  permissionName: string;
  description: string;
  status: string;
}

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState<Permission[]>(initialPermissionsData);
  const stats = useMemo(() => {
    const totalPermissions = permissions.length;
    const activePermissions = permissions.filter(
      (permission) => permission.status === 'Active'
    ).length;
    const inactivePermissions = permissions.filter(
      (permission) => permission.status === 'Inactive'
    ).length;
    return {
      totalPermissions,
      activePermissions,
      inactivePermissions,
    };
  }, [permissions]);
  const handleAddPermission = (permissionData: PermissionFormValues) => {
    const newId = permissions.length > 0 ? Math.max(...permissions.map((p) => p.id)) + 1 : 1;
    const newPermission: Permission = {
      id: newId,
      permissionName: permissionData.permissionName,
      description: permissionData.description,
      status: permissionData.status,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setPermissions((prev) => [newPermission, ...prev]);
  };
  const handleDeletePermission = (id: number) => {
    setPermissions((prev) => prev.filter((permission) => permission.id !== id));
  };
  const handleEditPermission = (permission: Permission) => {
    console.log('Edit permission:', permission);
  };
  return (
    <div className="flex flex-col gap-4">
      {}
      <div className="@container/main px-4 lg:px-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Permission Management</h1>
          <p className="text-muted-foreground">Manage system permissions and access controls.</p>
        </div>
      </div>
      {}
      <div className="@container/main px-4 lg:px-6 mt-4 lg:mt-6">
        <DataTable
          permissions={permissions}
          onDeletePermission={handleDeletePermission}
          onEditPermission={handleEditPermission}
          onAddPermission={handleAddPermission}
        />
      </div>
    </div>
  );
}
