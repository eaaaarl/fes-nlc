import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'
import ReportFacultyTable from './_components/ReportFacultyTable'

export default function ReportPages() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">
                    Faculty Report Management
                </h1>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Faculty Report Management</CardTitle>
                        <CardDescription>Manage and print faculty evaluation result</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <ReportFacultyTable />
                </CardContent>
            </Card>
        </div>
    )
}
