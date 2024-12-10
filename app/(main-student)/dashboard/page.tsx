'use client'

import React from 'react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { BookOpen, CheckCircle, Calendar } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'

export function DashboardSkeleton() {
    return (
        <SidebarInset className="flex flex-col">
            <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
                <SidebarTrigger className="-ml-1">
                    <Skeleton className="w-8 h-8 rounded-full" />
                </SidebarTrigger>
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem className="hidden md:block">
                            <Skeleton className="h-4 w-20" />
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="hidden md:block" />
                        <BreadcrumbItem>
                            <Skeleton className="h-4 w-16" />
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </header>

            <div className="space-y-4 gap-4 p-4">
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-5 w-48" />
            </div>

            <div className='flex flex-1 flex-col gap-4 p-4 pt-4'>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((_, index) => (
                        <Card
                            key={index}
                            className="animate-pulse hover:shadow-lg transition-shadow"
                        >
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-6 w-6 rounded-full" />
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Skeleton className="h-7 w-24" />
                                <Skeleton className="h-4 w-36" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>


            {/*    <div className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-24" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((_, index) => (
                        <Skeleton key={index} className="h-24 w-full" />
                    ))}
                </div>
            </div> */}
        </SidebarInset>
    )
}

export default function DashboardPage() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['dashboard', 'students-stats'],
        queryFn: async () => {
            const response = await fetch(`/api/student/dashboard`)
            if (!response.ok) {
                const err = await response.json()
                throw new Error(err.error || 'Failed to fetch stats')
            }
            return response.json()
        }
    })

    const statIcons = {
        subjects: <BookOpen className="w-6 h-6 text-blue-500" />,
        evaluated: <CheckCircle className="w-6 h-6 text-green-500" />,
        semester: <Calendar className="w-6 h-6 text-purple-500" />
    }

    const dashboardStats = [
        {
            icon: statIcons.subjects,
            title: 'Total Subjects',
            value: data?.subject || 0,
            description: 'Subjects registered this semester'
        },
        {
            icon: statIcons.evaluated,
            title: 'Total Evaluated',
            value: data?.totalEvaluated || 0,
            description: 'Subjects already evaluated'
        },
        {
            icon: statIcons.semester,
            title: 'Current Semester',
            value: data?.semester || 'N/A',
            description: 'Academic period'
        }
    ]



    if (isLoading) {
        return <DashboardSkeleton />
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-full text-red-500 p-6">
                <p>Error loading dashboard: {error.message}</p>
            </div>
        )
    }

    return (
        <SidebarInset className="flex flex-col">
            <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem className="hidden md:block">
                            <BreadcrumbLink href="#">Evaluation</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="hidden md:block" />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Overview</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </header>

            <div className="space-y-4 gap-4 p-4">
                <h1 className="text-2xl font-bold">Dashboard Overview</h1>
                <p className="text-muted-foreground">Welcome to Your Dashboard</p>
            </div>

            <div className='flex flex-1 flex-col gap-4 p-4 pt-4'>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {dashboardStats.map((stat, index) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                {stat.icon}
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground">{stat.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

        </SidebarInset>
    )
}