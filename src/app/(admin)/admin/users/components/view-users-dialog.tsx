'use client';

// ViewUsersDialog - displays detailed user information
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IconMail, IconCalendar, IconUser, IconShield, IconClock } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

interface User {
  id: string;
  surname: string;
  given_name: string;
  email: string;
  status: string;
  role: string;
  created_at: string;
  updated_at: string;
}

interface ViewUsersDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// getStatusColor - returns status badge color classes
const getStatusColor = (status: string): string => {
  switch (status) {
    case 'active':
      return 'bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400 border-green-200 dark:border-green-800';
    case 'pending':
      return 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
    case 'inactive':
      return 'bg-gray-50 text-gray-700 dark:bg-gray-900/40 dark:text-gray-400 border-gray-200 dark:border-gray-800';
    default:
      return 'bg-gray-50 text-gray-700 dark:bg-gray-900/40 dark:text-gray-400 border-gray-200 dark:border-gray-800';
  }
};

// getRoleColor - returns role badge color classes
const getRoleColor = (role: string): string => {
  switch (role) {
    case 'admin':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    case 'guest':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
  }
};

// getFullName - combines surname and given name
const getFullName = (user: User): string => {
  return `${user.given_name} ${user.surname}`;
};

export function ViewUsersDialog({ user, open, onOpenChange }: ViewUsersDialogProps) {
  // ==================== HANDLE CLOSE ====================
  const handleClose = () => {
    onOpenChange(false);
  };

  if (!user) return null;

  // ==================== RENDER ====================
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl p-0 gap-0 max-h-[90vh] overflow-y-auto">
        {/* header */}
        <DialogHeader className="p-6 pb-4 border-b sticky top-0 bg-background z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <DialogTitle className="text-xl font-semibold tracking-tight">{getFullName(user)}</DialogTitle>
                <DialogDescription className="text-xs mt-0.5">User Information & Account Details</DialogDescription>
              </div>
            </div>
            {/* status badge */}
            <Badge className={cn('px-3 py-1 text-xs font-medium border', getStatusColor(user.status))}>{user.status}</Badge>
          </div>
        </DialogHeader>

        {/* content */}
        <div className="p-6 space-y-6">
          {/* user details section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2">
              <IconUser size={16} className="text-muted-foreground" />
              <p className="text-sm font-medium">Personal Information</p>
            </div>

            {/* name and email */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Full Name</p>
                <p className="text-sm font-medium">{getFullName(user)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Email Address</p>
                <p className="text-sm font-medium">{user.email}</p>
              </div>
            </div>
          </div>

          {/* role and status section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2">
              <IconShield size={16} className="text-muted-foreground" />
              <p className="text-sm font-medium">Access & Permissions</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Role</p>
                <Badge className={cn('px-2 py-1 text-xs', getRoleColor(user.role))}>{user.role}</Badge>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Status</p>
                <Badge className={cn('px-2 py-1 text-xs', getStatusColor(user.status))}>{user.status}</Badge>
              </div>
            </div>
          </div>

          {/* dates section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2">
              <IconCalendar size={16} className="text-muted-foreground" />
              <p className="text-sm font-medium">Account Timeline</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Joined Date</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm">{new Date(user.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Last Updated</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm">{new Date(user.updated_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* info box */}
          <div className="flex items-start gap-2.5 p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-lg border border-blue-100 dark:border-blue-900">
            <IconShield size={16} className="text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-blue-700 dark:text-blue-400">User Management</p>
              <p className="text-xs text-muted-foreground mt-0.5">Manage user permissions and roles in the edit section.</p>
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="px-6 py-4 border-t bg-muted/30 flex justify-end sticky bottom-0">
          <Button variant="outline" onClick={handleClose} className="cursor-pointer">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
