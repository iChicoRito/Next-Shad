'use client';

// ==================== IMPORTS ====================
import { useState, useMemo } from 'react';
import { DataTable } from './components/data-table';
import initialPermissionsData from './data.json';

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

// ==================== COMPONENT ====================

// PermissionsPage - Main page component for permission management
export default function PermissionsPage() {
    // ==================== STATE MANAGEMENT ====================

    // State for storing all permissions data
    const [permissions, setPermissions] = useState<Permission[]>(initialPermissionsData);

    // ==================== STATISTICS CALCULATION ====================

    // Calculate permission statistics
    // Memoized to prevent unnecessary recalculations
    const stats = useMemo(() => {
        const totalPermissions = permissions.length;
        const activePermissions = permissions.filter(permission => permission.status === 'Active').length;
        const inactivePermissions = permissions.filter(permission => permission.status === 'Inactive').length;

        return {
            totalPermissions,
            activePermissions,
            inactivePermissions,
        };
    }, [permissions]);

    // ==================== EVENT HANDLERS ====================

    // Handle adding a new permission
    // Creates a new permission object with auto-incremented ID and current date
    // @param permissionData - Form data for the new permission
    const handleAddPermission = (permissionData: PermissionFormValues) => {
        // Calculate new ID (max existing ID + 1)
        const newId = permissions.length > 0 ? Math.max(...permissions.map(p => p.id)) + 1 : 1;

        const newPermission: Permission = {
            id: newId,
            permissionName: permissionData.permissionName,
            description: permissionData.description,
            status: permissionData.status,
            createdAt: new Date().toISOString().split('T')[0], // Format: YYYY-MM-DD
        };

        // Add new permission to the beginning of the list
        setPermissions(prev => [newPermission, ...prev]);
    };

    // Handle deleting a permission
    // Removes permission with specified ID from the list
    // @param id - ID of the permission to delete
    const handleDeletePermission = (id: number) => {
        setPermissions(prev => prev.filter(permission => permission.id !== id));
    };

    // Handle editing a permission
    // Currently logs to console, can be extended with edit dialog
    // @param permission - Permission data to edit
    const handleEditPermission = (permission: Permission) => {
        // TODO: Implement edit functionality with dialog
        console.log('Edit permission:', permission);
    };

    // ==================== RENDER ====================

    return (
        <div className='flex flex-col gap-4'>
            {/* Page Header */}
            <div className='@container/main px-4 lg:px-6'>
                <div className='flex flex-col gap-2'>
                    <h1 className='text-2xl font-bold tracking-tight'>Permission Management</h1>
                    <p className='text-muted-foreground'>Manage system permissions and access controls.</p>
                </div>
            </div>

            {/* Data Table Component */}
            <div className='@container/main px-4 lg:px-6 mt-8 lg:mt-12'>
                <DataTable permissions={permissions} onDeletePermission={handleDeletePermission} onEditPermission={handleEditPermission} onAddPermission={handleAddPermission} />
            </div>
        </div>
    );
}
