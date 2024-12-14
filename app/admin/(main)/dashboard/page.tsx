'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import {
    Users,
    GraduationCap,
    BookOpen,
    CheckCircle,
    Circle
} from 'lucide-react'
import { Skeleton } from "@/components/ui/skeleton"
import DashboardChartData from './_components/DashboardChartData'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from '@/components/ui/breadcrumb'

interface DashboardStats {
    totalUsers: number;
    totalFaculty: number;
    totalStudents: number;
    totalSubjects: number;
    totalEvaluated: number;
    currentSemester: string;
    activeUsers: number;
}

const STAT_CONFIG = {
    totalUsers: {
        icon: Users,
        title: "Total Users",
        bgColor: "bg-blue-50",
        iconBg: "bg-blue-100",
        textColor: "text-blue-600"
    },
    totalFaculty: {
        icon: Users,
        title: "Faculty",
        bgColor: "bg-green-50",
        iconBg: "bg-green-100",
        textColor: "text-green-600"
    },
    totalStudents: {
        icon: GraduationCap,
        title: "Students",
        bgColor: "bg-purple-50",
        iconBg: "bg-purple-100",
        textColor: "text-purple-600"
    },
    totalSubjects: {
        icon: BookOpen,
        title: "Total Subjects",
        bgColor: "bg-yellow-50",
        iconBg: "bg-yellow-100",
        textColor: "text-yellow-600"
    },
    totalEvaluated: {
        icon: CheckCircle,
        title: "Total Evaluated",
        bgColor: "bg-red-50",
        iconBg: "bg-red-100",
        textColor: "text-red-600"
    },
    /*  currentSemester: {
         icon: Calendar,
         title: "Current Semester",
         bgColor: "bg-indigo-50",
         iconBg: "bg-indigo-100",
         textColor: "text-indigo-600"
     }, */
    activeUsers: {
        icon: Circle,
        title: "Active Users",
        bgColor: "bg-green-50",
        iconBg: "bg-green-100",
        textColor: "text-green-600"
    }
}

export default function DashboardPages() {
    const { data: stats, isLoading, isError } = useQuery<DashboardStats>({
        queryKey: ['dashboard', 'stats'],
        queryFn: async () => {
            const response = await fetch(`/api/admin/dashboard`)
            if (!response.ok) {
                throw new Error('Failed to fetch dashboard stats')
            }
            return response.json()
        }
    })

    const DashboardSkeleton = () => (
        <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Skeleton className="h-8 w-64" />
                </div>
            </header>

            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="space-y-4 gap-4 mb-4">
                    <Skeleton className="h-10 w-1/2 mb-2" />
                    <Skeleton className="h-6 w-1/3" />
                </div>

                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        {[1, 2, 3, 4, 5, 6].map((_, index) => (
                            <Skeleton key={index} className="h-40 w-full rounded-xl" />
                        ))}
                    </div>

                    <div className="grid grid-cols-1">
                        <Skeleton className="h-96 w-full rounded-xl" />
                    </div>
                </div>
            </div>
        </SidebarInset>
    )

    const StatCard = ({
        icon: Icon,
        title,
        value,
        bgColor,
        iconBg,
        textColor
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }: any) => (
        <div className={`${bgColor} rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}>
            <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className={`${iconBg} p-2 rounded-full`}>
                        <Icon className={`h-6 w-6 ${textColor}`} />
                    </div>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
                    <p className={`text-2xl font-bold ${textColor}`}>
                        {typeof value === 'number' ? value.toLocaleString() : value}
                    </p>
                </div>
            </div>
        </div>
    )

    if (isError) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-500 text-xl">Failed to load dashboard statistics</p>
            </div>
        )
    }

    if (isLoading) {
        return <DashboardSkeleton />
    }

    const dashboardStats = stats ? Object.entries(STAT_CONFIG).map(([key, config]) => ({
        ...config,
        value: stats[key as keyof DashboardStats],
    })) : []

    return (
        <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            {/*  <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="#">
                                    Dashboard
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" /> */}
                            <BreadcrumbItem>
                                <BreadcrumbPage>DASHBOARD</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>



            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="min-h-screen p-8">
                    <div className="space-y-4 gap-4 mb-4">
                        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
                        <p className="text-muted-foreground">Welcome to Your Dashboard</p>
                    </div>
                    <div className="container mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                            {dashboardStats.map((stat, index) => (
                                <StatCard key={index} {...stat} />
                            ))}
                        </div>
                        {stats && (
                            <div className="grid grid-cols-1">
                                <DashboardChartData stats={stats} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </SidebarInset>

    )
}