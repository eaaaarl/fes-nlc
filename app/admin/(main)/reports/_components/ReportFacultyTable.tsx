'use client'

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table';
import { FacultyEvaluationResult } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import { Printer } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function ReportFacultyTable() {
    const router = useRouter()
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

    const handlePrint = (facultyId: string) => {
        const url = `/print/${facultyId}/result`
        router.push(url)
    };

    if (isLoading) return <div>Loading...</div>

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Total Evaluator</TableHead>
                    <TableHead>Total Score</TableHead>
                    <TableHead>Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data?.map((faculty) => (
                    <TableRow key={faculty.facultyId}>
                        <TableCell>{faculty.facultyName}</TableCell>
                        <TableCell>{faculty.facultyDepartment}</TableCell>
                        <TableCell>{faculty.totalEvaluators}</TableCell>
                        <TableCell>{faculty.totalScore}</TableCell>
                        <TableCell>
                            <Button
                                onClick={() => handlePrint(faculty.facultyId)}
                                disabled={!faculty.totalEvaluators || !faculty.totalScore}
                            >
                                <Printer />
                                <span>Print</span>
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
