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
import { BookOpen, CheckCircle, Calendar } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { DashboardSkeleton } from './DashboardSkeleton'



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