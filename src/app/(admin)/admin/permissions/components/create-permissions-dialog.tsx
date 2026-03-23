'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

// Role interface
interface Role {
  id: number;
  roleName: string;
  status: string;
}

// Permission item schema for repeater
const permissionItemSchema = z.object({
  roleId: z.string().min(1, { message: 'Please select a role.' }),
  permissionName: z.string().min(2, { message: 'Please enter a permission name.' }),
  description: z.string().min(5, { message: 'Please enter a description.' }),
  status: z.string().min(1, { message: 'Please select a status.' }),
});

// Form schema with repeater
const permissionFormSchema = z.object({
  permissions: z.array(permissionItemSchema).min(1, { message: 'At least one permission is required.' }),
});

type PermissionFormValues = z.infer<typeof permissionFormSchema>;

interface PermissionFormDialogProps {
  onAddPermission: () => void;
}

export function PermissionFormDialog({ onAddPermission }: PermissionFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

  // ==================== FETCH ROLES ====================
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from('tbl_roles').select('id, role_name, status').eq('status', 'Active').order('role_name');

        if (error) throw error;

        const mappedRoles: Role[] = data.map((item: any) => ({
          id: item.id,
          roleName: item.role_name,
          status: item.status,
        }));

        setRoles(mappedRoles);
      } catch (error: any) {
        toast.error(error.message || 'Failed to fetch roles');
      } finally {
        setLoadingRoles(false);
      }
    };

    if (open) {
      fetchRoles();
    }
  }, [open]);

  // ==================== FORM SETUP ====================
  const form = useForm<PermissionFormValues>({
    resolver: zodResolver(permissionFormSchema),
    defaultValues: {
      permissions: [
        {
          roleId: '',
          permissionName: '',
          description: '',
          status: '',
        },
      ],
    },
  });

  // Field array for repeater
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'permissions',
  });

  // ==================== HANDLE ADD PERMISSION ROW ====================
  const handleAddRow = () => {
    append({
      roleId: '',
      permissionName: '',
      description: '',
      status: '',
    });
  };

  // ==================== HANDLE SUBMIT ====================
  async function onSubmit(data: PermissionFormValues) {
    setIsSubmitting(true);

    try {
      const supabase = createClient();

      // Insert all permissions in parallel
      const insertPromises = data.permissions.map((permission) =>
        supabase.from('tbl_permission').insert({
          role_id: parseInt(permission.roleId),
          permission_name: permission.permissionName,
          description: permission.description,
          status: permission.status,
        })
      );

      const results = await Promise.all(insertPromises);

      // Check for any errors
      const errors = results.filter((result) => result.error);
      if (errors.length > 0) {
        throw new Error(errors[0].error?.message || 'Failed to create permissions');
      }

      // Success toast
      toast.success(`${data.permissions.length} permission(s) created successfully!`);

      // Reset form and close dialog
      form.reset({
        permissions: [
          {
            roleId: '',
            permissionName: '',
            description: '',
            status: '',
          },
        ],
      });
      setOpen(false);

      // Refresh parent data
      onAddPermission();
    } catch (error: any) {
      // Error toast
      toast.error(error.message || 'Failed to create permissions');
    } finally {
      setIsSubmitting(false);
    }
  }

  // ==================== RENDER ====================
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer gap-2">
          <IconPlus size={18} />
          Add New Permission
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Permissions</DialogTitle>
          <DialogDescription>Create one or more permissions and assign them to roles. Click save when you&apos;re done.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* permissions repeater */}
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-4 p-4 border rounded-lg relative">
                {/* remove button */}
                {fields.length > 1 && (
                  <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 h-8 w-8 cursor-pointer" onClick={() => remove(index)}>
                    <IconTrash size={16} className="text-red-500" />
                  </Button>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  {/* role selection */}
                  <FormField
                    control={form.control}
                    name={`permissions.${index}.roleId`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loadingRoles}>
                          <FormControl>
                            <SelectTrigger className="cursor-pointer">
                              <SelectValue placeholder={loadingRoles ? 'Loading roles...' : 'Select role'} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {roles.map((role) => (
                              <SelectItem key={role.id} value={role.id.toString()}>
                                {role.roleName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* permission name */}
                  <FormField
                    control={form.control}
                    name={`permissions.${index}.permissionName`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Permission Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., manage_users, view_reports" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* description */}
                <FormField
                  control={form.control}
                  name={`permissions.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter permission description" className="min-h-[80px] resize-y" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* status */}
                <FormField
                  control={form.control}
                  name={`permissions.${index}.status`}
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
              </div>
            ))}

            {/* add another permission button */}
            <Button type="button" variant="outline" className="cursor-pointer gap-2 w-full" onClick={handleAddRow}>
              <IconPlus size={16} />
              Add Another Permission
            </Button>

            <DialogFooter>
              <Button type="submit" className="cursor-pointer" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : `Save ${fields.length} Permission(s)`}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
