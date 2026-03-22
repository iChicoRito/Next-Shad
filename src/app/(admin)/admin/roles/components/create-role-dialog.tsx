'use client';

// ==================== IMPORTS ====================
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IconPlus } from '@tabler/icons-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// ==================== TYPES & INTERFACES ====================

// Zod schema for role form validation
const roleFormSchema = z.object({
    // Role name - required, minimum 2 characters
    roleName: z.string().min(2, {
        message: 'Please enter a role name.',
    }),
    // Role description - required, minimum 5 characters
    description: z.string().min(5, {
        message: 'Please enter a description.',
    }),
    // Role status - required, must be selected
    status: z.string().min(1, {
        message: 'Please select a status.',
    }),
});

// TypeScript type inferred from zod schema
type RoleFormValues = z.infer<typeof roleFormSchema>;

// Props for RoleFormDialog component
interface RoleFormDialogProps {
    // Callback function triggered when a new role is added
    onAddRole: (role: RoleFormValues) => void;
}

// ==================== COMPONENT ====================

// RoleFormDialog - Modal dialog for creating new roles
export function RoleFormDialog({ onAddRole }: RoleFormDialogProps) {
    // State for dialog open/close
    const [open, setOpen] = useState(false);

    // ==================== FORM SETUP ====================
    // Initialize react-hook-form with zod validation
    const form = useForm<RoleFormValues>({
        resolver: zodResolver(roleFormSchema),
        defaultValues: {
            roleName: '',
            description: '',
            status: '',
        },
    });

    // ==================== EVENT HANDLERS ====================

    // Handle form submission
    // Validates data with zod, calls parent callback, resets form, closes dialog
    // @param data - Validated form data
    function onSubmit(data: RoleFormValues) {
        // Pass the new role data to parent component
        onAddRole(data);
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
                    Add New Role
                </Button>
            </DialogTrigger>

            <DialogContent className='sm:max-w-2xl'>
                <DialogHeader>
                    <DialogTitle>Add New Role</DialogTitle>
                    <DialogDescription>Create a new role with permissions. Click save when you&apos;re done.</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                        {/* Role Name Field */}
                        <FormField
                            control={form.control}
                            name='roleName'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Enter role name (e.g., Administrator, Moderator)' {...field} />
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
                                        <Textarea placeholder='Enter role description' className='min-h-[100px] resize-y' {...field} />
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
                                Save Role
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
