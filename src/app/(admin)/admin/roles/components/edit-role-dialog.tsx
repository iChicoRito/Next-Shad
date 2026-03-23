'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { IconLock, IconShield, IconLoader2 } from '@tabler/icons-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { Badge } from '@/components/ui/badge';

// Role interface
interface Role {
  id: number;
  roleName: string;
  description: string;
  status: string;
  createdAt: string;
}

// Permission interface
interface Permission {
  id: number;
  permissionName: string;
  description: string;
  status: string;
}

// Edit role form schema
const editRoleFormSchema = z.object({
  roleName: z.string().min(2, {
    message: 'Role name must be at least 2 characters.',
  }),
  description: z.string().min(5, {
    message: 'Description must be at least 5 characters.',
  }),
  status: z.string().min(1, {
    message: 'Please select a status.',
  }),
});

type EditRoleFormValues = z.infer<typeof editRoleFormSchema>;

interface EditRoleDialogProps {
  role: Role | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRoleUpdated: () => void;
}

export function EditRoleDialog({ role, open, onOpenChange, onRoleUpdated }: EditRoleDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const [initialPermissions, setInitialPermissions] = useState<number[]>([]);

  // ==================== FETCH PERMISSIONS ====================
  useEffect(() => {
    const fetchPermissions = async () => {
      if (!open || !role) return;

      setLoadingPermissions(true);
      try {
        const supabase = createClient();

        // Fetch all available permissions
        const { data: allPermissions, error: allError } = await supabase.from('tbl_permission').select('id, permission_name, description, status').eq('status', 'Active').order('permission_name');

        if (allError) throw allError;

        // Fetch permissions assigned to this role
        const { data: rolePermissions, error: roleError } = await supabase.from('tbl_permission').select('id').eq('role_id', role.id);

        if (roleError) throw roleError;

        const mappedPermissions: Permission[] = allPermissions.map((item: any) => ({
          id: item.id,
          permissionName: item.permission_name,
          description: item.description || '',
          status: item.status,
        }));

        const assignedIds = rolePermissions.map((item: any) => item.id);

        setPermissions(mappedPermissions);
        setSelectedPermissions(assignedIds);
        setInitialPermissions(assignedIds);
      } catch (error: any) {
        toast.error(error.message || 'Failed to fetch permissions');
      } finally {
        setLoadingPermissions(false);
      }
    };

    fetchPermissions();
  }, [role, open]);

  // ==================== FORM SETUP ====================
  const form = useForm<EditRoleFormValues>({
    resolver: zodResolver(editRoleFormSchema),
    defaultValues: {
      roleName: role?.roleName || '',
      description: role?.description || '',
      status: role?.status || '',
    },
  });

  // Update form values when role changes
  useEffect(() => {
    if (role) {
      form.reset({
        roleName: role.roleName,
        description: role.description,
        status: role.status,
      });
    }
  }, [role, form]);

  // ==================== HANDLE PERMISSION TOGGLE ====================
  const handlePermissionToggle = (permissionId: number, checked: boolean) => {
    if (checked) {
      setSelectedPermissions((prev) => [...prev, permissionId]);
    } else {
      setSelectedPermissions((prev) => prev.filter((id) => id !== permissionId));
    }
  };

  // ==================== HANDLE SUBMIT ====================
  async function onSubmit(data: EditRoleFormValues) {
    if (!role) return;

    setIsSubmitting(true);

    try {
      const supabase = createClient();

      // Update role details
      const { error: roleError } = await supabase
        .from('tbl_roles')
        .update({
          role_name: data.roleName,
          description: data.description,
          status: data.status,
        })
        .eq('id', role.id);

      if (roleError) throw roleError;

      // Handle permission changes
      const permissionsToAdd = selectedPermissions.filter((id) => !initialPermissions.includes(id));
      const permissionsToRemove = initialPermissions.filter((id) => !selectedPermissions.includes(id));

      // Add new permissions
      if (permissionsToAdd.length > 0) {
        const insertPromises = permissionsToAdd.map((permissionId) =>
          supabase.from('tbl_permission').insert({
            role_id: role.id,
            permission_name: permissions.find((p) => p.id === permissionId)?.permissionName || '',
            description: permissions.find((p) => p.id === permissionId)?.description || '',
            status: 'Active',
          })
        );

        const results = await Promise.all(insertPromises);
        const errors = results.filter((result) => result.error);
        if (errors.length > 0) {
          throw new Error(errors[0].error?.message || 'Failed to add permissions');
        }
      }

      // Remove permissions
      if (permissionsToRemove.length > 0) {
        const { error: deleteError } = await supabase.from('tbl_permission').delete().eq('role_id', role.id).in('id', permissionsToRemove);

        if (deleteError) throw deleteError;
      }

      // Success toast
      toast.success('Role updated successfully!');

      // Close dialog and refresh
      onOpenChange(false);
      onRoleUpdated();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update role');
    } finally {
      setIsSubmitting(false);
    }
  }

  // ==================== HANDLE CLOSE ====================
  const handleClose = () => {
    form.reset();
    setSelectedPermissions([]);
    setInitialPermissions([]);
    onOpenChange(false);
  };

  if (!role) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Role: {role.roleName}</DialogTitle>
          <DialogDescription>Update role details and manage permissions. Click save when you&apos;re done.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* role name field */}
            <FormField
              control={form.control}
              name="roleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter role name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* description field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter role description" className="min-h-[100px] resize-y" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* status field */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="cursor-pointer">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* permissions section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-2">
                <h3 className="text-sm font-medium">Role Permissions</h3>
                <Badge variant="secondary" className="ml-2">
                  {selectedPermissions.length}
                </Badge>
              </div>

              {loadingPermissions ? (
                <div className="flex items-center justify-center py-8">
                  <IconLoader2 size={24} className="animate-spin text-muted-foreground" />
                </div>
              ) : permissions.length > 0 ? (
                <div className="grid gap-3 p-1">
                  {permissions.map((permission) => (
                    <div key={permission.id} className="flex items-start space-x-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                      <Checkbox id={`permission-${permission.id}`} checked={selectedPermissions.includes(permission.id)} onCheckedChange={(checked) => handlePermissionToggle(permission.id, checked as boolean)} className="mt-0.5" />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <label htmlFor={`permission-${permission.id}`} className="text-sm font-medium leading-none cursor-pointer">
                            {permission.permissionName}
                          </label>
                        </div>
                        {permission.description && <p className="text-xs text-muted-foreground">{permission.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <IconShield size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No permissions available</p>
                  <p className="text-xs mt-1">Create permissions in the Permissions page first</p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose} className="cursor-pointer">
                Cancel
              </Button>
              <Button type="submit" className="cursor-pointer" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
