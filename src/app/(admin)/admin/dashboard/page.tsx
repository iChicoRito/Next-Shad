import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { MetricsOverview } from './components/metrics-overview';
import { SalesChart } from './components/sales-chart';
import { RecentTransactions } from './components/recent-transactions';
import { TopProducts } from './components/top-products';
import { CustomerInsights } from './components/customer-insights';
import { QuickActions } from './components/quick-actions';
import { RevenueBreakdown } from './components/revenue-breakdown';

// Dashboard - admin dashboard with real user data
export default async function Dashboard() {
  // ==================== AUTH CHECK ====================
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/sign-in');
  }

  // ==================== GET USER PROFILE ====================
  // fetch profile for display name only (role check handled by middleware)
  const { data: profile } = await supabase.from('tbl_users').select('given_name, surname').eq('id', user.id).single();

  // ==================== METRICS DATA ====================
  // fetch real user metrics
  const { count: totalUsers } = await supabase.from('tbl_users').select('*', { count: 'exact', head: true });
  const { count: activeUsers } = await supabase.from('tbl_users').select('*', { count: 'exact', head: true }).eq('status', 'active');
  const { count: pendingUsers } = await supabase.from('tbl_users').select('*', { count: 'exact', head: true }).eq('status', 'pending');

  // build display name
  const displayName = profile?.given_name ? `${profile.given_name} ${profile.surname || ''}` : user.email?.split('@')[0] || 'Admin';

  return (
    <div className="flex-1 space-y-6 px-6 pt-0">
      <div className="flex md:flex-row flex-col md:items-center justify-between gap-4 md:gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Welcome back, {displayName}</h1>
          <p className="text-muted-foreground">Monitor your business performance and key metrics in real-time</p>
        </div>
        <QuickActions />
      </div>

      <div className="@container/main space-y-6">
        {/* pass real user metrics data to component */}
        {/* <MetricsOverview totalUsers={totalUsers || 0} activeUsers={activeUsers || 0} pendingUsers={pendingUsers || 0} /> */}

        <div className="grid gap-6 grid-cols-1 @5xl:grid-cols-2">
          <SalesChart />
          <RevenueBreakdown />
        </div>

        <div className="grid gap-6 grid-cols-1 @5xl:grid-cols-2">
          <RecentTransactions />
          <TopProducts />
        </div>

        <CustomerInsights />
      </div>
    </div>
  );
}
