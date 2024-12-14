"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import StudentTableData from './_components/StudentTableData'
import StudentMobileCards from './_components/StudentMobileCard'
import { useQuery } from '@tanstack/react-query'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from '@/components/ui/breadcrumb'

interface Student {
    id: string,
    studentId: string;
    fullName: string,
    department: string,
    plaintTextPassword:
    {
        plainTextPassword: string
    },
    subjects: string
}

export default function StudentPage() {

    const { data, isLoading } = useQuery({
        queryKey: ['create', 'student'],
        queryFn: async (): Promise<Student[]> => {
            const response = await fetch(`/api/admin/student`)
            if (!response.ok) {
                const err = await response.json()
                throw new Error(err.error || "Failed to fetch student")
            }
            return response.json()
        }
    })
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
                                    Students
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" /> */}
                            <BreadcrumbItem>
                                <BreadcrumbPage>STUDENTS</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>

            <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-semibold md:text-2xl">
                        List of Students
                    </h1>
                    <div className='flex gap-4'>
                        <Link href="/admin/students/add">
                            <Button className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Add Student
                            </Button>
                        </Link>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div className='space-y-4'>
                                <CardTitle>Student Management</CardTitle>
                                <CardDescription>Manage and view student information</CardDescription>
                            </div>

                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="hidden md:block">
                            <StudentTableData />
                        </div>

                        <StudentMobileCards
                            data={data}
                            isLoading={isLoading}
                        />
                    </CardContent>
                </Card>
            </div>
        </SidebarInset>

    )
}