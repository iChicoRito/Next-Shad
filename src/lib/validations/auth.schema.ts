// Auth validation schemas
import { z } from 'zod';

// Sign-up schema with contact number
export const signUpSchema = z.object({
  given_name: z.string().min(1, 'First name is required'),
  surname: z.string().min(1, 'Last name is required'),
  contact_number: z.string().min(10, 'Contact number must be at least 10 digits'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Please confirm your password'),
  terms: z.boolean().refine((val) => val === true, 'You must agree to the terms'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export type SignUpValues = z.infer<typeof signUpSchema>;

// Sign-in schema
export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type SignInValues = z.infer<typeof signInSchema>;