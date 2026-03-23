'use client';

// StatCards - displays user statistics from data
import { Card, CardContent } from '@/components/ui/card';
import { IconUsers, IconUserCheck, IconClock, IconUserX, IconArrowUp, IconArrowDown } from '@tabler/icons-react';

interface StatCardsProps {
  totalUsers: number;
  activeUsers: number;
  pendingUsers: number;
  inactiveUsers: number;
}

export function StatCards({ totalUsers, activeUsers, pendingUsers, inactiveUsers }: StatCardsProps) {
  // ==================== CALCULATE PERCENTAGES ====================
  const activePercentage = totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0;
  const pendingPercentage = totalUsers > 0 ? (pendingUsers / totalUsers) * 100 : 0;
  const inactivePercentage = totalUsers > 0 ? (inactiveUsers / totalUsers) * 100 : 0;

  // ==================== RENDER ====================
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Users Card */}
      <Card>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Total Users</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold">{totalUsers}</span>
                <span className="flex items-center gap-0.5 text-sm text-green-500">
                  <IconArrowUp className="size-3.5" />
                  {totalUsers > 0 ? '100%' : '0%'}
                </span>
              </div>
            </div>
            <div className="bg-secondary rounded-lg p-3">
              <IconUsers className="size-6" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Users Card */}
      <Card>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Active Users</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold">{activeUsers}</span>
                <span className="flex items-center gap-0.5 text-sm text-green-500">
                  <IconArrowUp className="size-3.5" />
                  {Math.round(activePercentage)}%
                </span>
              </div>
            </div>
            <div className="bg-secondary rounded-lg p-3">
              <IconUserCheck className="size-6" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending Users Card */}
      <Card>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Pending Users</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold">{pendingUsers}</span>
                <span className="flex items-center gap-0.5 text-sm text-orange-500">
                  <IconArrowUp className="size-3.5" />
                  {Math.round(pendingPercentage)}%
                </span>
              </div>
            </div>
            <div className="bg-secondary rounded-lg p-3">
              <IconClock className="size-6" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inactive Users Card */}
      <Card>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Inactive Users</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold">{inactiveUsers}</span>
                <span className="flex items-center gap-0.5 text-sm text-red-500">
                  <IconArrowDown className="size-3.5" />
                  {Math.round(inactivePercentage)}%
                </span>
              </div>
            </div>
            <div className="bg-secondary rounded-lg p-3">
              <IconUserX className="size-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
