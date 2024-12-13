import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { loginAdminSchema, loginAdminValues } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { Building, Key, Loader2 } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useAdminLogin } from '../mutation'
import { useRouter } from 'next/navigation'

export default function AdminLoginForm() {
    const router = useRouter()
    const form = useForm({
        resolver: zodResolver(loginAdminSchema),
        defaultValues: {
            username: '',
            password: ''
        }
    })

    const { mutate, status: isLoading } = useAdminLogin()

    const onSubmit = (payload: loginAdminValues) => {

        mutate(payload, {
            onSuccess: () => {
                form.reset({
                    'username': payload.username,
                    'password': '********************************************************'
                })

                router.push('/admin/dashboard')
            },
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <FormField
                            control={form.control}
                            name={'username'}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className=' flex items-center text-blue-900'>
                                        <Building className="mr-2 h-4 w-4 text-blue-700" />
                                        Username
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid gap-2">
                        <FormField
                            control={form.control}
                            name={'password'}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className=' flex items-center text-blue-900'>
                                        <Key className="mr-2 h-4 w-4 text-blue-700" />
                                        Password
                                    </FormLabel>
                                    <FormControl>
                                        <Input type='password' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full mt-4 bg-blue-800 hover:bg-blue-900"
                        disabled={isLoading === 'pending'}
                    >
                        {isLoading === 'pending' ? (
                            <><Loader2 className="h-5 w-5 animate-spin mr-2" /> loading...</>
                        ) : (
                            'Login'
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
