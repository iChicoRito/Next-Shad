'use client';

// ==================== IMPORTS ====================
import { useState, useMemo } from 'react';
import { DataTable } from './components/data-table';
import initialRolesData from './data.json';

// ==================== TYPES & INTERFACES ====================

// Role data structure
interface Role {
  // Unique identifier for the role
  id: number;
  // Display name of the role
  roleName: string;
  // Detailed description of the role
  description: string;
  // Current status (Active, Inactive, Pending)
  status: string;
  // Creation date of the role
  createdAt: string;
}

// Form values for role creation/editing
interface RoleFormValues {
  // Role display name
  roleName: string;
  // Role description
  description: string;
  // Role status
  status: string;
}

// ==================== COMPONENT ====================

// RolesPage - Main page component for role management
export default function RolesPage() {
  // ==================== STATE MANAGEMENT ====================

  // State for storing all roles data
  const [roles, setRoles] = useState<Role[]>(
    initialRolesData.map(({ id, roleName, description, status, createdAt }) => ({
      id,
      roleName,
      description,
      status,
      createdAt,
    }))
  );

  // ==================== STATISTICS CALCULATION ====================

  // Calculate role statistics
  // Memoized to prevent unnecessary recalculations
  const stats = useMemo(() => {
    const totalRoles = roles.length;
    const activeRoles = roles.filter(role => role.status === 'Active').length;
    const inactiveRoles = roles.filter(role => role.status === 'Inactive').length;

    return {
      totalRoles,
      activeRoles,
      inactiveRoles,
    };
  }, [roles]);

  // ==================== EVENT HANDLERS ====================

  // Handle adding a new role
  // Creates a new role object with auto-incremented ID and current date
  // @param roleData - Form data for the new role
  const handleAddRole = (roleData: RoleFormValues) => {
    // Calculate new ID (max existing ID + 1)
    const newId = Math.max(...roles.map(r => r.id)) + 1;

    const newRole: Role = {
      id: newId,
      roleName: roleData.roleName,
      description: roleData.description,
      status: roleData.status,
      createdAt: new Date().toISOString().split('T')[0], // Format: YYYY-MM-DD
    };
    // Add new role to the beginning of the list
    setRoles(prev => [newRole, ...prev]);
  };

  // Handle deleting a role
  // Removes role with specified ID from the list
  // @param id - ID of the role to delete
  const handleDeleteRole = (id: number) => {
    setRoles(prev => prev.filter(role => role.id !== id));
  };

  // Handle editing a role
  // Currently logs to console, can be extended with edit dialog
  // @param role - Role data to edit
  const handleEditRole = (role: Role) => {
    // TODO: Implement edit functionality with dialog
    console.log('Edit role:', role);
  };

  // ==================== RENDER ====================

  return (
    <div className='flex flex-col gap-4'>
      {/* Page Header */}
      <div className='@container/main px-4 lg:px-6'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-2xl font-bold tracking-tight'>Role-Based Access Control</h1>
          <p className='text-muted-foreground'>Build a secure system with structured role management.</p>
        </div>
      </div>

      {/* Data Table Component */}
      <div className='@container/main px-4 lg:px-6 mt-8 lg:mt-12'>
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