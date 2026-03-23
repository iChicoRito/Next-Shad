// Middleware - route protection and authentication
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// protected routes that require authentication
const protectedRoutes = ['/dashboard', '/profile', '/settings'];
// auth routes (redirect to dashboard if already logged in)
const authRoutes = ['/auth/sign-in', '/auth/sign-up'];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // create supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // get current user session
  const { data: { session } } = await supabase.auth.getSession();
  const pathname = request.nextUrl.pathname;

  // check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // redirect to sign-in if accessing protected route without session
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/auth/sign-in', request.url);
    redirectUrl.searchParams.set('redirected', 'true');
    return NextResponse.redirect(redirectUrl);
  }

  // redirect to dashboard if accessing auth route with session
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

// configure which routes middleware runs on
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};