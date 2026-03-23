'use client';

// DeleteUsersDialog - confirmation dialog for user deletion
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { IconAlertTriangle } from '@tabler/icons-react';

interface DeleteUsersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
  onConfirm: () => void;
}

export function DeleteUsersDialog({ open, onOpenChange, userName, onConfirm }: DeleteUsersDialogProps) {
  // ==================== HANDLE CONFIRM ====================
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  // ==================== RENDER ====================
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
              <IconAlertTriangle size={24} className="text-red-600 dark:text-red-400" />
            </div>
          </div>
          <DialogTitle className="text-center">Delete User</DialogTitle>
          <DialogDescription className="text-center pt-2">
            Are you sure you want to delete the user <span className="font-semibold">"{userName}"</span>?
            <br />
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row gap-2">
          <Button variant="destructive" onClick={handleConfirm} className="cursor-pointer flex-1">
            Delete
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer flex-1">
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
