// Middleware - route protection and authentication
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

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

  // get session
  const { data: { session } } = await supabase.auth.getSession();
  const pathname = request.nextUrl.pathname;

  // check route types
  const isAdminRoute = pathname.startsWith('/admin');
  const isGuestRoute = pathname.startsWith('/guest');
  const isAuthRoute = pathname.startsWith('/auth');

  console.log('Session:', !!session);
  console.log('Admin route:', isAdminRoute);
  console.log('Guest route:', isGuestRoute);

  // ==================== NO SESSION ====================
  // redirect to login for protected routes
  if (!session && (isAdminRoute || isGuestRoute)) {
    console.log('No session, redirecting to login');
    const redirectUrl = new URL('/auth/sign-in', request.url);
    redirectUrl.searchParams.set('redirected', 'true');
    return NextResponse.redirect(redirectUrl);
  }

  // ==================== WITH SESSION ====================
  if (session) {
    // fetch user role from database
    const { data: profile, error } = await supabase
      .from('tbl_users')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (error) {
      console.error('Profile fetch error:', error.message);
    }

    const userRole = profile?.role;
    console.log('User role:', userRole);

    // BLOCK ADMIN FROM GUEST ROUTES
    if (isGuestRoute && userRole === 'admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    // BLOCK GUEST FROM ADMIN ROUTES
    if (isAdminRoute && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/guest/dashboard', request.url));
    }

    // redirect auth routes to appropriate dashboard
    if (isAuthRoute) {
      const dashboard = userRole === 'admin' ? '/admin/dashboard' : '/guest/dashboard';
      console.log('Auth route, redirecting to:', dashboard);
      return NextResponse.redirect(new URL(dashboard, request.url));
    }
  }

  return response;
}

// configure which routes middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};