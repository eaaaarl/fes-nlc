"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserPlus } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import FacultyTableData from './_components/FacultyTableData'
import FacultyMobileCards from './_components/FacultyMobileCards'
import { useQuery } from '@tanstack/react-query'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@radix-ui/react-separator'
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from '@/components/ui/breadcrumb'

interface Faculty {
    id: string,
    fullName: string,
    department: string,
    subjects: string,
    plaintTextPassword:
    {
        plainTextPassword: string
    }
}

export default function FacultyPage() {


    const { data, isLoading } = useQuery({
        queryKey: ['create', 'faculty'],
        queryFn: async (): Promise<Faculty[]> => {
            const response = await fetch(`/api/admin/faculty`)
            if (!response.ok) {
                const err = await response.json()
                throw new Error(err.error || "Failed to fetch faculty")
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
                                    Faculty
                                </BreadcrumbLink>
                            </BreadcrumbItem> */}
                            {/*  <BreadcrumbSeparator className="hidden md:block" /> */}
                            <BreadcrumbItem>
                                <BreadcrumbPage>FACULTY</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>

            <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-semibold md:text-2xl">
                        Faculty Management
                    </h1>
                    <div className='flex gap-4'>

                        <Link href="/admin/faculty/add">
                            <Button className="flex items-center gap-2">
                                <UserPlus className="h-4 w-4" />
                                Add Faculty
                            </Button>
                        </Link>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div className='space-y-4'>
                                <CardTitle>Faculty Management</CardTitle>
                                <CardDescription>Manage and view faculty information</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="hidden md:block">
                            <FacultyTableData />
                        </div>

                        <FacultyMobileCards
                            data={data}
                            isLoading={isLoading}
                        />
                    </CardContent>
                </Card>
            </div>
        </SidebarInset>
    )
}

