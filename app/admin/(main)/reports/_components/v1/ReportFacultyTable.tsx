'use client'
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
    TableCell
} from '@/components/ui/table';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React from 'react';
import {
    Dialog,

    DialogTrigger
} from '@/components/ui/dialog';
import { ListCollapse } from 'lucide-react';
import { ReportFacultyTableSkeleton } from './ReportFacultyTableSkeleton';

export interface CategoryScore {
    averageRating: string;
    normalizedValue: string;
    weightedAverage: string;
    weight: string;
}

export interface SubjectEvaluation {
    subjectName: string;
    totalEvaluators: number;
    breakdown: Record<string, CategoryScore>;
    totalScore: string;
}

export interface FacultyEvaluationResult {
    facultyId: string;
    facultyName: string;
    facultyDepartment: string;
    facultySubjects: string[];
    totalEvaluators: number;
    facultyBreakdown: Record<string, CategoryScore>;
    facultyTotalScore: string;
    subjectEvaluations: SubjectEvaluation[];
}

export default function ReportFacultyTable() {
    const router = useRouter();

    const { data, isLoading } = useQuery({
        queryKey: ['evaluation', 'result'],
        queryFn: async (): Promise<FacultyEvaluationResult[]> => {
            const response = await fetch(`/api/admin/evaluation-result/v2`);
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || '(f): Failed to fetch evaluation result');
            }
            return response.json();
        }
    });

    const handleViewDetails = (facultyId: string) => {
        router.push(`/admin/reports/${facultyId}/details`);
    };

    if (isLoading) return <ReportFacultyTableSkeleton />;

    return (
        <div className="space-y-4">
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
                            <TableCell>{faculty.facultyTotalScore}</TableCell>
                            <TableCell className="space-x-2">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant={'outline'}
                                            onClick={() => handleViewDetails(faculty.facultyId)}
                                            disabled={!faculty.totalEvaluators}
                                        >
                                            <ListCollapse />
                                        </Button>
                                    </DialogTrigger>
                                </Dialog>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}