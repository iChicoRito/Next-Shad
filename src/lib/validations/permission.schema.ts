// Permission form schema with Zod
import { z } from 'zod';

// Permission form schema
export const permissionFormSchema = z.object({
  permissionName: z.string().min(2, {
    message: 'Permission name must be at least 2 characters.',
  }),
  description: z.string().min(5, {
    message: 'Description must be at least 5 characters.',
  }),
  status: z.string().min(1, {
    message: 'Please select a status.',
  }),
});

// Permission with role assignment schema
export const permissionWithRolesSchema = z.object({
  permissions: z.array(
    z.object({
      roleId: z.string().min(1, { message: 'Please select a role.' }),
      permissionName: z.string().min(2, { message: 'Permission name must be at least 2 characters.' }),
      description: z.string().min(5, { message: 'Description must be at least 5 characters.' }),
      status: z.string().min(1, { message: 'Please select a status.' }),
    })
  ),
});

export type PermissionFormValues = z.infer<typeof permissionFormSchema>;
export type PermissionWithRolesValues = z.infer<typeof permissionWithRolesSchema>;