import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Edit, MoreHorizontal, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'
import ConfirmDeleteDialog from '@/components/ConfirmDeleteDialog'
import { useDeleteStudent } from '../mutation'

interface Student {
    id: string,
    studentId: string;
    fullName: string,
    department: string,
    plaintTextPassword: {
        plainTextPassword: string
    },
    subjects: string
}

export default function StudentMobileCards({
    data,
    isLoading
}: {
    data?: Student[],
    isLoading: boolean
}) {
    const router = useRouter()
    const [onConfirmDeleteDialog, setOnConfirmDeleteDialog] = useState(false)
    const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

    const { mutate, status } = useDeleteStudent()

    const handleDeleteDialog = (student: Student) => {
        setStudentToDelete(student)
        setOnConfirmDeleteDialog(true)
    }

    const handleDelete = () => {
        mutate(studentToDelete?.id as string, {
            onSuccess: () => {
                setOnConfirmDeleteDialog(false);
                setStudentToDelete(null)
            }
        })
    }

    const loadingSkeletons = Array(5).fill(0).map((_, index) => (
        <Card key={index} className="mb-4">
            <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                </div>
                <div className="mt-4">
                    <Skeleton className="h-8 w-full" />
                </div>
            </CardContent>
        </Card>
    ))

    return (
        <div className="space-y-4 md:hidden">
            {isLoading ? loadingSkeletons : data?.map((student) => (
                <Card key={student.id} className="w-full">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {student.fullName.toUpperCase()}
                        </CardTitle>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                >
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() => router.push(`/admin/students/${student.id}/edit`)}
                                >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="cursor-pointer text-destructive focus:text-destructive"
                                    onClick={() => handleDeleteDialog(student)}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">
                                <strong>ID No.:</strong> {student.studentId}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                <strong>Department:</strong> {student.department}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                <strong>Subjects:</strong> {student.subjects.length || '0'}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}

            <ConfirmDeleteDialog
                isOpen={onConfirmDeleteDialog}
                onCancel={() => setOnConfirmDeleteDialog(false)}
                itemName={studentToDelete?.fullName}
                onConfirm={handleDelete}
                isLoading={status === 'pending'}
            />
        </div>
    )
}