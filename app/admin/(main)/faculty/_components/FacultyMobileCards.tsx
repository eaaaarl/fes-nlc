import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Edit, MoreHorizontal, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'
import ConfirmDeleteDialog from '@/components/ConfirmDeleteDialog'
import { useDeleteFaculty } from '../mutation'

interface Faculty {
    id: string,
    fullName: string,
    department: string,
    subjects: string,
    plaintTextPassword: {
        plainTextPassword: string
    }
}

export default function FacultyMobileCards({
    data,
    isLoading
}: {
    data?: Faculty[],
    isLoading: boolean
}) {
    const router = useRouter()
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false)
    const [facultyToDelete, setFacultyToDelete] = useState<Faculty | null>(null);

    const { mutate: deleteFaculty, status: deleteFacultyLoading } = useDeleteFaculty()

    const handleOpenDeleteDialog = (faculty: Faculty) => {
        setFacultyToDelete(faculty);
        setOpenDeleteDialog(true)
    }

    const handleDelete = () => {
        deleteFaculty({ id: facultyToDelete?.id as string }, {
            onSuccess: () => {
                setFacultyToDelete(null);
                setOpenDeleteDialog(false)
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
            {isLoading ? loadingSkeletons : data?.map((faculty) => (
                <Card key={faculty.id} className="w-full">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {faculty.fullName.toUpperCase()}
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
                                    onClick={() => router.push(`/admin/faculty/${faculty.id}/edit`)}
                                >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="cursor-pointer text-destructive focus:text-destructive"
                                    onClick={() => handleOpenDeleteDialog(faculty)}
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
                                <strong>Department:</strong> {faculty.department}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                <strong>Subjects:</strong> {faculty.subjects.length || '0'}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}

            <ConfirmDeleteDialog
                isOpen={openDeleteDialog}
                onCancel={() => setOpenDeleteDialog(false)}
                onConfirm={handleDelete}
                itemName={facultyToDelete?.fullName}
                isLoading={deleteFacultyLoading === 'pending'}
            />
        </div>
    )
}