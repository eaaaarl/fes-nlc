"use client"
import React from 'react'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChangePasswordAdminSchema, ChangePasswordAdminValues } from '@/lib/validation';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';
import { PasswordInput } from '@/components/PasswordInput';
import { useChangePasswordAdmin } from './mutation';

interface ChangePasswordProps {
    onOpen: boolean;
    onCancel: () => void
}

export default function ChangePassword({ onOpen, onCancel }: ChangePasswordProps) {
    const form = useForm({
        resolver: zodResolver(ChangePasswordAdminSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        }
    })

    const { mutate, status } = useChangePasswordAdmin()

    const onSubmit = (payload: ChangePasswordAdminValues) => {
        mutate({ payload }, {
            onSuccess: () => {
                form.reset({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                })
                onCancel()
            }
        })
    }

    return (
        <AlertDialog open={onOpen}>
            <AlertDialogContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <AlertDialogHeader className='mb-4'>
                            <AlertDialogTitle>Change Password?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Please enter your current password and a new password.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <FormField
                            control={form.control}
                            name={'currentPassword'}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Current Password
                                    </FormLabel>
                                    <FormControl>
                                        <PasswordInput {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={'newPassword'}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        New Password
                                    </FormLabel>
                                    <FormControl>
                                        <PasswordInput {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={'confirmPassword'}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Confirm Password
                                    </FormLabel>
                                    <FormControl>
                                        <PasswordInput {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='mt-4 space-x-4'>
                            <Button
                                type='button'
                                onClick={() => {
                                    onCancel()
                                    form.reset({
                                        currentPassword: '',
                                        newPassword: '',
                                        confirmPassword: ''
                                    })
                                }}
                                variant={'outline'}
                            >
                                Cancel
                            </Button>
                            <Button
                                type='submit'
                                variant={'default'}
                                disabled={status === 'pending'}
                            >
                                {status === 'pending' ? (<Loader className='h-4 w-4 animate-spin' />) : 'Save'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </AlertDialogContent>
        </AlertDialog>
    )
}