'use client';

// DeleteDialog - confirmation dialog for deleting roles
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { IconAlertTriangle } from '@tabler/icons-react';

interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roleName: string;
  onConfirm: () => void;
}

export function DeleteDialog({ open, onOpenChange, roleName, onConfirm }: DeleteDialogProps) {
  // ==================== HANDLE CONFIRM ====================
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  // ==================== RENDER ====================
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
              <IconAlertTriangle size={20} className="text-red-600 dark:text-red-400" />
            </div>
            <DialogTitle>Delete Role</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            Are you sure you want to delete the role <span className="font-semibold">"{roleName}"</span>?
            <br />
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm} className="cursor-pointer">
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
