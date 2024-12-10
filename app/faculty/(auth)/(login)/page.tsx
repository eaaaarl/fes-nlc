"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { Loader2, BookOpen, ShieldCheck, KeyRound, User, GraduationCap } from "lucide-react"

export default function FacultyLoginForm() {
    const router = useRouter()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const handleLogin = (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        // Simulated login logic
        setTimeout(() => {
            if (username === "faculty" && password === "faculty123") {
                // Successful login
                setIsLoading(false)
                router.push('/faculty/dashboard')
            } else {
                // Failed login
                setIsLoading(false)
                setError("Invalid faculty credentials. Please try again.")
            }
        }, 1500)
    }

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
            <Card className="flex w-full max-w-5xl shadow-2xl border-2 border-emerald-700 overflow-hidden">
                <div className="relative hidden w-1/2 md:block">
                    <Image
                        src="/nemsu-login.jpg"  // Use a distinct background image for faculty
                        alt="NEMSU Faculty Login"
                        layout="fill"
                        objectFit="cover"
                        className="brightness-50"
                    />
                    <div className="absolute inset-0 flex flex-col">
                        {/* 
                        <div className="flex justify-center p-6">
                            <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-center">
                                <Image
                                    src="/nemsu-logo.png"
                                    alt="NEMSU Lianga Campus Logo"
                                    width={100}
                                    height={100}
                                    className="object-contain"
                                />
                            </div>
                        </div> */}

                        {/* System and School Information */}
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-8 text-white">
                            <h2 className="text-3xl font-bold mb-2 flex items-center justify-center">
                                <BookOpen className="mr-3 h-8 w-8" />
                                Faculty Portal
                            </h2>
                            <p className="text-lg text-center">Northern Mindanao State University - Lianga Campus</p>
                        </div>
                    </div>
                </div>
                <div className="w-full p-8 md:w-1/2 flex flex-col justify-center bg-white">
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            <GraduationCap className="h-12 w-12 text-emerald-700" />
                        </div>
                        <CardTitle className="text-2xl mb-2 text-emerald-900">Faculty Access Portal</CardTitle>
                        <CardDescription className="text-emerald-700">
                            Secure Login for Faculty Members
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin}>
                            <div className="grid gap-4">
                                {error && (
                                    <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-red-700 text-center">
                                        {error}
                                    </div>
                                )}
                                <div className="grid gap-2">
                                    <Label className="flex items-center text-emerald-900">
                                        <User className="mr-2 h-4 w-4 text-emerald-700" />
                                        Faculty ID
                                    </Label>
                                    <Input
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Enter your faculty ID"
                                        className="border-emerald-300 focus:border-emerald-500"
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="flex items-center text-emerald-900">
                                            <KeyRound className="mr-2 h-4 w-4 text-emerald-700" />
                                            Password
                                        </Label>
                                        <Link
                                            href="/faculty/forgot-password"
                                            className="text-sm text-emerald-700 hover:underline"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <Input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        className="border-emerald-300 focus:border-emerald-500"
                                        required
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full mt-4 bg-emerald-800 hover:bg-emerald-900"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <><Loader2 className="h-5 w-5 animate-spin mr-2" /> Logging in...</>
                                    ) : (
                                        'Faculty Login'
                                    )}
                                </Button>
                                <div className="text-center mt-4">
                                    <Link
                                        href="/faculty/first-time-login"
                                        className="text-sm text-emerald-700 hover:underline"
                                    >
                                        First-time login? Get started
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </div>
            </Card>
        </div>
    )
}