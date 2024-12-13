"use client"

import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Edit, MoreHorizontal, Trash2 } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from 'next/navigation'
import ConfirmDeleteDialog from '@/components/ConfirmDeleteDialog'
import { useDeleteStudent } from '../mutation'

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

export default function StudentTableData() {
    const router = useRouter()
    const [onConfirmDeleteDialog, setOnConfirmDeleteDialog] = useState(false)
    const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
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

    const loadingSkeletons = Array(5).fill(0).map((_, index) => (
        <TableRow key={index}>
            <TableCell><Skeleton className="h-4 w-[50px]" /></TableCell>
            <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
            <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
            <TableCell><Skeleton className="h-4 w-[40px]" /></TableCell>
            <TableCell>
                <Skeleton className="h-8 w-8 rounded-md" />
            </TableCell>
        </TableRow>
    ))

    const handleDeleteDialog = (student: Student) => {
        setStudentToDelete(student)
        setOnConfirmDeleteDialog(true)
    }

    const { mutate, status } = useDeleteStudent()

    const handleDelete = () => {
        mutate(studentToDelete?.id as string, {
            onSuccess: () => {
                setOnConfirmDeleteDialog(false);
                setStudentToDelete(null)
            }
        })
    }
    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID No.</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? loadingSkeletons : data?.map((s) => (
                        <TableRow key={s.id}>
                            <TableCell>
                                {s.studentId}
                            </TableCell>
                            <TableCell>
                                {s.fullName}
                            </TableCell>
                            <TableCell>
                                {s.department}
                            </TableCell>
                            <TableCell>
                                {s.subjects.length > 0 ? s.subjects.length : '0'}
                            </TableCell>
                            <TableCell>
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
                                            onClick={() => router.push(`/admin/students/${s.id}/edit`)}
                                        >
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            className="cursor-pointer text-destructive focus:text-destructive"
                                            onClick={() => handleDeleteDialog(s)}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <ConfirmDeleteDialog
                isOpen={onConfirmDeleteDialog}
                onCancel={() => setOnConfirmDeleteDialog(false)}
                itemName={studentToDelete?.fullName}
                onConfirm={handleDelete}
                isLoading={status === 'pending'}
            />

        </>
    )
}
