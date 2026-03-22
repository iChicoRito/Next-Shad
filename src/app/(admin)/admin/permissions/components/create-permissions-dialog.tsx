'use client';

// ==================== IMPORTS ====================
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IconPlus } from '@tabler/icons-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// ==================== TYPES & INTERFACES ====================

// Zod schema for permission form validation
const permissionFormSchema = z.object({
    // Permission name - required, minimum 2 characters
    permissionName: z.string().min(2, {
        message: 'Please enter a permission name.',
    }),
    // Permission description - required, minimum 5 characters
    description: z.string().min(5, {
        message: 'Please enter a description.',
    }),
    // Permission status - required, must be selected
    status: z.string().min(1, {
        message: 'Please select a status.',
    }),
});

// TypeScript type inferred from zod schema
type PermissionFormValues = z.infer<typeof permissionFormSchema>;

// Props for PermissionFormDialog component
interface PermissionFormDialogProps {
    // Callback function triggered when a new permission is added
    onAddPermission: (permission: PermissionFormValues) => void;
}

// ==================== COMPONENT ====================

// PermissionFormDialog - Modal dialog for creating new permissions
export function PermissionFormDialog({ onAddPermission }: PermissionFormDialogProps) {
    // State for dialog open/close
    const [open, setOpen] = useState(false);

    // ==================== FORM SETUP ====================

    // Initialize react-hook-form with zod validation
    const form = useForm<PermissionFormValues>({
        resolver: zodResolver(permissionFormSchema),
        defaultValues: {
            permissionName: '',
            description: '',
            status: '',
        },
    });

    // ==================== EVENT HANDLERS ====================

    // Handle form submission
    function onSubmit(data: PermissionFormValues) {
        // Pass the new permission data to parent component
        onAddPermission(data);
        // Reset form to default values
        form.reset();
        // Close the dialog
        setOpen(false);
    }

    // ==================== RENDER ====================

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {/* Button that triggers the dialog */}
            <DialogTrigger asChild>
                <Button className='cursor-pointer gap-2'>
                    <IconPlus size={18} />
                    Add New Permission
                </Button>
            </DialogTrigger>

            <DialogContent className='sm:max-w-2xl'>
                <DialogHeader>
                    <DialogTitle>Add New Permission</DialogTitle>
                    <DialogDescription>Create a new permission. Click save when you&apos;re done.</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                        {/* Permission Name Field */}
                        <FormField
                            control={form.control}
                            name='permissionName'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Permission Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Enter permission name (e.g., Manage Users, View Reports)' {...field} />
                                    </FormControl>
                                    {/* Display validation error message */}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Description Field */}
                        <FormField
                            control={form.control}
                            name='description'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Enter permission description' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Status Selection Field */}
                        <FormField
                            control={form.control}
                            name='status'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className='cursor-pointer w-full'>
                                                <SelectValue placeholder='Select status' />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value='Active'>Active</SelectItem>
                                            <SelectItem value='Inactive'>Inactive</SelectItem>
                                            <SelectItem value='Pending'>Pending</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type='submit' className='cursor-pointer'>
                                Save Permission
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
