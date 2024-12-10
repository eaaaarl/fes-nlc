import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import StudentTableData from './_components/StudentTableData'



export default function StudentPage() {
    return (
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
                        <CardTitle>Student Management</CardTitle>
                        <CardDescription>Manage and view student information</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <StudentTableData />
                </CardContent>
            </Card>
        </div>
    )
}