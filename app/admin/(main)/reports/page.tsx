"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'
import ReportFacultyTable from './_components/v0/ReportFacultyTable'
import { ReportFacultyTableMobileCards } from './_components/v0/ReportFacultyMobileCard'
import { useQuery } from '@tanstack/react-query'
import { FacultyEvaluationResult } from '@/lib/types'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@radix-ui/react-separator'
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from '@/components/ui/breadcrumb'

export default function ReportPages() {

    const { data, isLoading } = useQuery({
        queryKey: ['evaluation', 'result'],
        queryFn: async (): Promise<FacultyEvaluationResult[]> => {
            const response = await fetch(`/api/admin/evaluation-result/v1`)
            if (!response.ok) {
                const err = await response.json()
                throw new Error(err.error || '(f): Failed to fetch evaluation result')
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
                                <BreadcrumbPage>REPORTS</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>

            <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-semibold md:text-2xl">
                        Faculty Report Management
                    </h1>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div className='space-y-4'>
                                <CardTitle>Faculty Report Management</CardTitle>
                                <CardDescription>Manage and print faculty evaluation result</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="hidden md:block">
                            <ReportFacultyTable />
                        </div>

                        <ReportFacultyTableMobileCards
                            data={data}
                            isLoading={isLoading}
                        />
                    </CardContent>
                </Card>
            </div>
        </SidebarInset>

    )
}
