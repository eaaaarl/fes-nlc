"use client"

import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Edit, MoreHorizontal, Trash2 } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from 'next/navigation'

export default function StudentTableData() {
    const router = useRouter()
    const { data, isLoading } = useQuery({
        queryKey: ['create', 'faculty'],
        queryFn: async (): Promise<{
            id: string,
            fullName: string,
            department: string,
            plaintTextPassword:
            {
                plainTextPassword: string
            },
            subjects: string
        }[]> => {
            const response = await fetch(`/api/admin/student`)
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
            <TableCell><Skeleton className="h-4 w-[40px]" /></TableCell>
            <TableCell>
                <Skeleton className="h-8 w-8 rounded-md" />
            </TableCell>
        </TableRow>
    ))


    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>ID No.</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>PlainText Password</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading ? loadingSkeletons : data?.map((s) => (
                    <TableRow key={s.id}>
                        <TableCell>
                            {s.id}
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
                            {s.plaintTextPassword?.plainTextPassword}
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
    )
}
