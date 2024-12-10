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
import { Loader2, Lock, ShieldCheck, KeyRound, User, Building } from "lucide-react"
import AdminLoginForm from "./_components/adminLogin-form"

export default function page() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-blue-900 to-indigo-900">
            <Card className="flex w-full max-w-5xl shadow-2xl border-2 border-blue-700 overflow-hidden">
                <div className="relative hidden w-1/2 md:block">
                    <Image
                        src="/nemsu-login.jpg"
                        alt="NEMSU Administrator Login"
                        layout="fill"
                        objectFit="cover"
                        className="brightness-50"
                    />
                    <div className="absolute inset-0 flex flex-col">
                        {/* <div className="flex justify-center p-6">
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

                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-8 text-white">
                            <h2 className="text-3xl font-bold mb-2 flex items-center justify-center">
                                <Lock className="mr-3 h-8 w-8" />
                                Administrator Portal
                            </h2>
                            <p className="text-lg text-center">Northern Mindanao State University - Lianga Campus</p>
                        </div>
                    </div>
                </div>
                <div className="w-full p-8 md:w-1/2 flex flex-col justify-center bg-white">
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            <ShieldCheck className="h-12 w-12 text-blue-700" />
                        </div>
                        <CardTitle className="text-2xl mb-2 text-blue-900">Secure Administrator Access</CardTitle>
                        <CardDescription className="text-blue-700">
                            Enter your administrative credentials
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AdminLoginForm />
                    </CardContent>
                </div>
            </Card>
        </div>
    )
}