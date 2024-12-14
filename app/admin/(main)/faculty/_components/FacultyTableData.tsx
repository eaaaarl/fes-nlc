import React, { useState } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Edit, MoreHorizontal, Trash2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from 'next/navigation'
import ConfirmDeleteDialog from '@/components/ConfirmDeleteDialog'
import { useDeleteFaculty } from '../mutation'

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


export default function FacultyTableData() {
    const router = useRouter()
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false)
    const [facultyToDelete, setFacultyToDelete] = useState<Faculty | null>(null);

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

    const handleOpenDeleteDialog = (faculty: Faculty) => {
        setFacultyToDelete(faculty);
        setOpenDeleteDialog(true)
    }

    const { mutate: deleteFaculty, status: deleteFacultyLoading } = useDeleteFaculty()
    const handleDelete = () => {
        deleteFaculty({ id: facultyToDelete?.id as string }, {
            onSuccess: () => {
                setFacultyToDelete(null);
                setOpenDeleteDialog(false)
            }
        })
    }
    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Faculty Name</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? loadingSkeletons : data?.map((f) => (
                        <TableRow key={f.id}>
                            <TableCell>
                                {f.fullName}
                            </TableCell>
                            <TableCell>
                                {f.department}
                            </TableCell>
                            <TableCell>
                                {f.subjects.length > 0 ? f.subjects.length : '0'}
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
                                            onClick={() => router.push(`/admin/faculty/${f.id}/edit`)}
                                        >
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            className="cursor-pointer text-destructive focus:text-destructive"
                                            onClick={() => handleOpenDeleteDialog(f)}
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
                isOpen={openDeleteDialog}
                onCancel={() => setOpenDeleteDialog(false)}
                onConfirm={handleDelete}
                itemName={facultyToDelete?.fullName}
                isLoading={deleteFacultyLoading === 'pending'}
            />

        </>
    )
}
