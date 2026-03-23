// User validation schemas
import { z } from 'zod';

// ==================== CREATE USER SCHEMA ====================
export const createUserSchema = z.object({
  surname: z.string().min(1, { message: 'Surname is required' }),
  givenName: z.string().min(1, { message: 'Given name is required' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string().min(1, { message: 'Please confirm your password' }),
  status: z.string().min(1, { message: 'Please select a status' }),
  role: z.string().min(1, { message: 'Please select a role' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;

// ==================== UPDATE USER SCHEMA ====================
export const updateUserSchema = z.object({
  surname: z.string().min(1, { message: 'Surname is required' }),
  givenName: z.string().min(1, { message: 'Given name is required' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  status: z.string().min(1, { message: 'Please select a status' }),
  role: z.string().min(1, { message: 'Please select a role' }),
});

export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;