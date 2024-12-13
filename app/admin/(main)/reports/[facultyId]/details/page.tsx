'use client'
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

import { Printer } from 'lucide-react';
import { PageWithBackButton } from '../../../_components/PageWithBackButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FacultyDetailPageSkeleton } from './FacultyDetailsPageSkeleton';


interface SubjectEvaluation {
    subjectName: string;
    totalEvaluators: number;
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    breakdown: Record<string, any>;
    totalScore: string;
}

interface FacultyEvaluation {
    facultyId: string;
    facultyName: string;
    facultyDepartment: string;
    facultySubjects: string[];
    totalEvaluators: number;
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    facultyBreakdown: Record<string, any>;
    facultyTotalScore: string;
    subjectEvaluations: SubjectEvaluation[];
}

export default function FacultyDetailPage() {
    const router = useRouter()
    const params = useParams();
    const facultyId = params.facultyId as string;

    const { data, isLoading } = useQuery({
        queryKey: ['faculty-detail', facultyId],
        queryFn: async (): Promise<FacultyEvaluation> => {
            const response = await fetch(`/api/admin/evaluation-result/faculty/${facultyId}/details`);
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Failed to fetch faculty details');
            }
            return response.json();
        }
    });

    const handlePrintSubject = (facultyId: string, subjectName: string) => {
        const url = `/print/subject/result?facultyId=${encodeURIComponent(facultyId)}&subjectName=${encodeURIComponent(subjectName)}`;
        router.push(url);
    };


    const styles = {
        header: {
            textAlign: 'center' as const,
            marginBottom: '20px',
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'center' as const,
            border: '1px solid black',
        },
        cell: {
            border: '1px solid black',
            padding: '8px',
        }
    };

    if (isLoading) {
        return <FacultyDetailPageSkeleton />
    }

    return (
        <PageWithBackButton
            backButtonHref='/admin/reports'
            pageTitle='Evaluation Details'
        >
            <Card>
                <div className="container mx-auto p-4">
                    <CardHeader>
                        <CardTitle>{data?.facultyName} - Evaluation Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div>
                            {data?.subjectEvaluations?.map((subject) => (
                                <div
                                    key={subject.subjectName}
                                    id={`subject-${subject.subjectName}`}
                                    className="mb-4"
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-md font-bold">{subject.subjectName}</h3>
                                        <div className="space-x-2">
                                            <span>Evaluators: {subject.totalEvaluators}</span>
                                            <span>Total Score: {subject.totalScore}</span>
                                        </div>
                                    </div>
                                    <table style={{
                                        width: '100%',
                                        borderCollapse: 'collapse',
                                        textAlign: 'center' as const,
                                        border: '1px solid black',
                                    }}>
                                        <thead>
                                            <tr>
                                                <th style={styles.cell}>COMMITMENT (20%)</th>
                                                <th style={styles.cell}>KNOWLEDGE OF SUBJECT (20%)</th>
                                                <th style={styles.cell}>MANAGEMENT OF LEARNING (30%)</th>
                                                <th style={styles.cell}>TEACHING FOR INDEPENDENT LEARNING (30%)</th>
                                                <th style={styles.cell}>Total Score (100%)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td style={styles.cell}>{subject.breakdown.COMMITMENT.weightedAverage || 0}</td>
                                                <td style={styles.cell}>{subject.breakdown.KNOWLEDGE_OF_SUBJECT.weightedAverage || 0}</td>
                                                <td style={styles.cell}>{subject.breakdown.TEACHING_FOR_INDEPENDENT_LEARNING.weightedAverage || 0}</td>
                                                <td style={styles.cell}>{subject.breakdown.MANAGEMENT_OF_LEARNING.weightedAverage || 0}</td>
                                                <td style={styles.cell}>{subject.totalScore || 0}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div className='gap-4 mt-4'>
                                        <Button
                                            variant={'outline'}
                                            className="bg-green-700 text-white hover:bg-green-800 hover:text-white"
                                            onClick={() => handlePrintSubject(data?.facultyId, subject.subjectName)}
                                        >
                                            <Printer className="mr-2" />
                                            Print {subject.subjectName} Evaluation
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </div>
            </Card>
        </PageWithBackButton>
    );
}