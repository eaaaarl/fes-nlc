"use client"

import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginStudentSchema, loginStudentValues } from "@/lib/validation"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useLoginStudent } from "../mutation"
import { useRouter } from "next/navigation"
import { Loader2, KeyRound, User } from "lucide-react"

export default function LoginForm() {
    const router = useRouter()
    const form = useForm({
        resolver: zodResolver(loginStudentSchema),
        defaultValues: {
            'studentId': '',
            'password': ''
        }
    })

    const { mutate, status } = useLoginStudent()

    const handleLogin = (payload: loginStudentValues) => {
        mutate(payload, {
            onSuccess: () => {
                form.reset({
                    'studentId': payload.studentId,
                    'password': '********************************************'
                })

                router.push('/dashboard')
            },
            onError: (error) => {
                form.setError('root', {
                    type: 'manual',
                    message: error.message || 'Login failed. Please try again.'
                })
            }
        });
    }

    return (
        <div className="flex h-screen w-full items-center justify-center ">
            <Card className="flex w-full max-w-5xl shadow-2xl overflow-hidden">
                <div className="relative hidden w-1/2 md:block">
                    <Image
                        src="/nemsu-login.jpg"
                        alt="NEMSU Faculty Evaluation System"
                        layout="fill"
                        objectFit="cover"
                        className="brightness-75"
                    />
                    <div className="absolute inset-0 flex flex-col">
                        <div className="flex justify-center p-6">
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-40 p-8 text-white">
                            <h2 className="text-3xl font-bold mb-2">Faculty Evaluation System</h2>
                            <p className="text-lg">Northern Mindanao State University - Lianga Campus</p>
                        </div>
                    </div>
                </div>
                <div className="w-full p-8 md:w-1/2 flex flex-col justify-center">
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            {/*  <Image
                                src="/nemsu-logo.png"
                                alt="NEMSU Lianga Campus Logo"
                                width={120}
                                height={120}
                                className="object-contain"
                            /> */}
                        </div>
                        <CardTitle className="text-3xl mb-2">STUDENT LOGIN</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleLogin)}>
                                <div className="grid gap-4">
                                    {form.formState.errors.root && (
                                        <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-red-700 text-center">
                                            {form.formState.errors.root.message}
                                        </div>
                                    )}
                                    <div className="grid gap-2">
                                        <FormField
                                            control={form.control}
                                            name={'studentId'}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center">
                                                        <User className="mr-2 h-4 w-4 text-muted-foreground" />
                                                        Student ID No.
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}

                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <div className="flex items-center justify-between">
                                            <Label className="flex items-center">
                                                <KeyRound className="mr-2 h-4 w-4 text-muted-foreground" />
                                                Password
                                            </Label>
                                            <Link
                                                href="/forgot-password"
                                                className="text-sm text-primary hover:underline"
                                            >
                                                Forgot password?
                                            </Link>
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name={'password'}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            type="password"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full mt-4"
                                        disabled={status === 'pending'}
                                    >
                                        {status === 'pending' ? (
                                            <><Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading...</>
                                        ) : (
                                            'Login'
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </div>
            </Card>
        </div>
    )
}