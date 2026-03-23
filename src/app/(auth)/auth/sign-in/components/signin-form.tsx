'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { IconBrandGoogleFilled, IconMailCheck } from '@tabler/icons-react';
import { signInSchema, SignInValues } from '@/lib/validations/auth.schema';
import { createClient } from '@/lib/supabase/client';

// LoginForm1 - handles user authentication and email confirmation
export function LoginForm1({ className, ...props }: React.ComponentProps<'div'>) {
  // ==================== STATE ====================
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  // ==================== FORM SETUP ====================
  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // ==================== HANDLE EMAIL CONFIRMATION FROM URL ====================
  useEffect(() => {
    const handleEmailConfirmation = async () => {
      // check for hash fragment from email confirmation
      const hash = window.location.hash;

      if (hash && hash.includes('access_token')) {
        setIsConfirming(true);

        try {
          const supabase = createClient();

          // parse the hash fragment
          const params = new URLSearchParams(hash.substring(1));
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');

          if (accessToken && refreshToken) {
            // set session from the tokens
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (error) throw error;

            if (data.user) {
              // update user status from pending to active
              await supabase.from('tbl_users').update({ status: 'active' }).eq('id', data.user.id);

              // clean up URL
              window.history.replaceState({}, '', '/auth/sign-in');
              toast.success('Email confirmed! You can now sign in.');
            }
          }
        } catch (error: any) {
          console.error('Confirmation error:', error);
          toast.error('Failed to confirm email. Please try again.');
        } finally {
          setIsConfirming(false);
        }
      }

      // check for registered parameter
      if (searchParams.get('registered') === 'true') {
        toast.success('Account created! Please check your email to confirm.');
      }
    };

    handleEmailConfirmation();
  }, [searchParams]);

  // ==================== HANDLE SUBMIT ====================
  const onSubmit = async (data: SignInValues) => {
    try {
      setIsLoading(true);

      // create supabase browser client
      const supabase = createClient();

      // sign in user
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        if (authError.message.includes('Email not confirmed')) {
          toast.error('Please confirm your email address before signing in.');
        } else if (authError.message.includes('Invalid login credentials')) {
          toast.error('Invalid email or password');
        } else {
          toast.error(authError.message);
        }
        return;
      }

      if (!authData.user) {
        toast.error('Login failed');
        return;
      }

      // fetch user role from tbl_users
      const { data: profile, error: profileError } = await supabase.from('tbl_users').select('role').eq('id', authData.user.id).single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        // fallback to guest dashboard if profile not found
        router.push('/guest/dashboard');
        router.refresh();
        return;
      }

      // role-based redirection
      if (profile?.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/guest/dashboard');
      }

      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== HANDLE GOOGLE LOGIN ====================
  const handleGoogleLogin = async () => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/sign-in`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || 'Google login failed');
    }
  };

  // ==================== RENDER ====================
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          {isConfirming ? (
            // confirmation loading state
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-muted-foreground">Confirming your email...</p>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-6">
                  <div className="grid gap-4">
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
                          <div className="flex items-center">
                            <FormLabel>Password</FormLabel>
                            <a href="/auth/forgot-password" className="ml-auto text-sm underline-offset-4 hover:underline">
                              Forgot your password?
                            </a>
                          </div>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* submit button */}
                    <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
                      {isLoading ? 'Signing in...' : 'Login'}
                    </Button>

                    {/* google login button */}
                    <Button variant="outline" className="w-full cursor-pointer gap-2" type="button" onClick={handleGoogleLogin}>
                      <IconBrandGoogleFilled size={18} />
                      Login with Google
                    </Button>
                  </div>
                  <div className="text-center text-sm">
                    Don&apos;t have an account?{' '}
                    <a href="/auth/sign-up" className="underline underline-offset-4">
                      Sign up
                    </a>
                  </div>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
