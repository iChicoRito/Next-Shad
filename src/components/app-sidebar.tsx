'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconLayoutDashboard, IconUser, IconUsers, IconBrandNextjs, IconShieldCheck, IconUserCircle } from '@tabler/icons-react';
import Link from 'next/link';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { createClient } from '@/lib/supabase/client';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // ==================== STATE ====================
  const [userData, setUserData] = useState({
    name: 'Loading...',
    email: '',
    avatar: '',
  });
  const [userRole, setUserRole] = useState<string>('guest');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // ==================== FETCH USER DATA ====================
  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // fetch profile data
        const { data: profile } = await supabase.from('tbl_users').select('given_name, surname, role').eq('id', user.id).single();

        const displayName = profile?.given_name ? `${profile.given_name} ${profile.surname || ''}` : user.email?.split('@')[0] || 'User';

        setUserData({
          name: displayName,
          email: user.email || '',
          avatar: '',
        });

        setUserRole(profile?.role || 'guest');
      }
      setIsLoading(false);
    };

    fetchUser();
  }, []);

  // ==================== GET NAVIGATION BASED ON ROLE ====================
  const getNavGroups = () => {
    if (userRole === 'admin') {
      return [
        {
          label: 'Admin Panel',
          items: [
            {
              title: 'Dashboard',
              url: '/admin/dashboard',
              icon: IconLayoutDashboard,
            },
          ],
        },
        {
          label: 'Manage Modules',
          items: [
            {
              title: 'Users',
              url: '#',
              icon: IconUsers,
              items: [
                {
                  title: 'View Users',
                  url: '/admin/users',
                },
                {
                  title: 'Restricted Users',
                  url: '/admin/restricted-users',
                },
              ],
            },
            {
              title: 'Access Control',
              url: '#',
              icon: IconShieldCheck,
              items: [
                {
                  title: 'Roles',
                  url: '/admin/roles',
                },
                {
                  title: 'Permissions',
                  url: '/admin/permissions',
                },
              ],
            },
          ],
        },
      ];
    }

    // guest navigation
    return [
      {
        label: 'Menu',
        items: [
          {
            title: 'Dashboard',
            url: '/guest/dashboard',
            icon: IconLayoutDashboard,
          },
        ],
      },
      {
        label: 'Account',
        items: [
          {
            title: 'Profile',
            url: '/guest/profile',
            icon: IconUserCircle,
          },
        ],
      },
    ];
  };

  // update dashboard URL based on role
  const dashboardUrl = userRole === 'admin' ? '/admin/dashboard' : '/guest/dashboard';

  // loading state
  if (isLoading) {
    return (
      <Sidebar {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <IconBrandNextjs stroke={2} />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Loading...</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
      </Sidebar>
    );
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={dashboardUrl}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <IconBrandNextjs stroke={2} />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Welcome Back!</span>
                  <span className="truncate text-xs">{userData.name}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {getNavGroups().map((group) => (
          <NavMain key={group.label} label={group.label} items={group.items} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
