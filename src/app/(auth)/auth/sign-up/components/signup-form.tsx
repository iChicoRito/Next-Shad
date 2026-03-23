'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { IconMailCheck } from '@tabler/icons-react';
import { signUpSchema, SignUpValues } from '@/lib/validations/auth.schema';
import { createClient } from '@/lib/supabase/client';

// SignupForm1 - handles user registration
export function SignupForm1({ className, ...props }: React.ComponentProps<'div'>) {
  // ==================== STATE ====================
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // ==================== FORM SETUP ====================
  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      given_name: '',
      surname: '',
      contact_number: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });

  // ==================== HANDLE SUBMIT ====================
  const onSubmit = async (data: SignUpValues) => {
    try {
      setIsLoading(true);

      const supabase = createClient();

      // Sign up user - trigger will automatically create profile
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            contact_number: data.contact_number,
            given_name: data.given_name,
            surname: data.surname,
          },
          emailRedirectTo: `${window.location.origin}/auth/sign-in`,
        },
      });

      if (authError) {
        if (authError.message.includes('User already registered')) {
          toast.error('Email already registered. Please sign in instead.');
        } else {
          toast.error(authError.message);
        }
        return;
      }

      // REMOVE this section - trigger handles it now
      // const { error: profileError } = await supabase.from('tbl_users').insert({ ... });

      // Show success screen
      setRegistrationSuccess(true);
      toast.success('Check your email for confirmation link');
      form.reset();
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== RENDER SUCCESS SCREEN ====================
  if (registrationSuccess) {
    return (
      <div className={cn('flex flex-col gap-6', className)} {...props}>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <IconMailCheck size={24} className="text-green-600" />
              </div>
              <CardTitle className="text-xl">Check your email</CardTitle>
              <CardDescription className="text-base">
                We've sent a confirmation link to <strong>{form.getValues('email')}</strong>
              </CardDescription>
              <div className="mt-4 p-4 bg-muted rounded-lg text-sm">
                <p className="text-muted-foreground">
                  Please click the link in your email to confirm your account. After confirmation,
                  you can sign in to your account.
                </p>
              </div>
              <Button
                variant="outline"
                className="mt-4 w-full"
                onClick={() => (window.location.href = '/auth/sign-in')}
              >
                Go to Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ==================== RENDER FORM ====================
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create Account</CardTitle>
          <CardDescription>Enter your information to create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-6">
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-3">
                    {/* given name field */}
                    <FormField
                      control={form.control}
                      name="given_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* surname field */}
                    <FormField
                      control={form.control}
                      name="surname"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {/* contact number field */}
                  <FormField
                    control={form.control}
                    name="contact_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Number</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="+63 912 345 6789" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* email field */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="m@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* password field */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* confirm password field */}
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* terms checkbox */}
                  <FormField
                    control={form.control}
                    name="terms"
                    render={({ field }) => (
                      <FormItem className="flex items-start space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="mt-0.5"
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          I agree to the terms of service and privacy policy
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  {/* submit button */}
                  <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Already have an account?{' '}
                  <a href="/auth/sign-in" className="underline underline-offset-4">
                    Sign in
                  </a>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a> and{' '}
        <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
