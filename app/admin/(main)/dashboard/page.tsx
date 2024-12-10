'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import {
    Users,
    GraduationCap,
    BookOpen,
    CheckCircle,
    Calendar,
    Circle
} from 'lucide-react'
import { Skeleton } from "@/components/ui/skeleton"

// Updated interface to include active users
interface DashboardStats {
    totalUsers: number;
    totalFaculty: number;
    totalStudents: number;
    totalSubjects: number;
    totalEvaluated: number;
    currentSemester: string;
    activeUsers: number; // New field for active/online users
}

// Updated STAT_CONFIG to include active users
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
    currentSemester: {
        icon: Calendar,
        title: "Current Semester",
        bgColor: "bg-indigo-50",
        iconBg: "bg-indigo-100",
        textColor: "text-indigo-600"
    },
    // New configuration for active users
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
        <div className="min-h-screen p-8">
            <div className="container mx-auto">
                <header className="mb-8">
                    <Skeleton className="h-10 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                </header>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7].map((_, index) => (
                        <Skeleton key={index} className="h-40 rounded-xl" />
                    ))}
                </div>
            </div>
        </div>
    )

    const StatCard = ({
        icon: Icon,
        title,
        value,
        bgColor,
        iconBg,
        textColor
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
        <div className="min-h-screen p-8">
            <div className="container mx-auto">
                <header className="mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Dashboard Overview</h1>
                    <p className="text-gray-500">Quick insights into your academic ecosystem</p>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dashboardStats.map((stat, index) => (
                        <StatCard key={index} {...stat} />
                    ))}
                </div>
            </div>
        </div>
    )
}