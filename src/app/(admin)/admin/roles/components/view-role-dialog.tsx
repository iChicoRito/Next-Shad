'use client';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IconClock } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

interface Role {
  id: number;
  roleName: string;
  description: string;
  status: string;
  createdAt: string;
}

interface ViewRoleDialogProps {
  role: Role | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Active':
      return 'bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400 border-green-200 dark:border-green-800';
    case 'Inactive':
      return 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border-red-200 dark:border-red-800';
    case 'Pending':
      return 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
    default:
      return 'bg-gray-50 text-gray-700 dark:bg-gray-900/40 dark:text-gray-400 border-gray-200 dark:border-gray-800';
  }
};

export function ViewRoleDialog({ role, open, onOpenChange }: ViewRoleDialogProps) {
  if (!role) return null;
  const handleClose = () => {
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 gap-0">
        {}
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <DialogTitle className="text-xl font-semibold tracking-tight">{role.roleName}</DialogTitle>
                <DialogDescription className="text-xs mt-0.5">Role Information</DialogDescription>
              </div>
            </div>
            {}
            <Badge className={cn('px-3 py-1 text-xs font-medium border', getStatusColor(role.status))}>{role.status}</Badge>
          </div>
        </DialogHeader>
        {}
        <div className="p-6 space-y-5">
          {}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">Description</p>
            </div>
            <p className="text-sm text-muted-foreground">{role.description}</p>
          </div>
          {}
          <div className="flex items-start gap-2.5 p-3 bg-yellow-50/50 dark:bg-yellow-950/20 rounded-lg border border-yellow-100 dark:border-yellow-900">
            <IconClock size={16} className="text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-yellow-700 dark:text-yellow-400">Role Management</p>
              <p className="text-xs text-muted-foreground mt-0.5">Manage permissions and user assignments in the edit section.</p>
            </div>
          </div>
        </div>
        {}
        <div className="px-6 py-4 border-t bg-muted/30 flex justify-end">
          <Button variant="outline" onClick={handleClose} className="cursor-pointer">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
