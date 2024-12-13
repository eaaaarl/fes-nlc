'use client';
import React, { useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
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

export default function FacultyPrintPage() {
    const router = useRouter();
    const componentRef = useRef(null);
    const params = useParams<{ facultyId: string }>();
    const { facultyId } = params;

    const { data, isLoading, error } = useQuery({
        queryKey: ['faculty-evaluation', facultyId],
        queryFn: async (): Promise<FacultyEvaluation> => {
            const response = await fetch(`/api/admin/evaluation-result/v2/${facultyId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch faculty evaluation');
            }
            return response.json();
        }
    });

    useEffect(() => {
        if (data) {
            const printTimeout = setTimeout(() => {
                try {
                    window.print();
                } catch (err) {
                    console.error('Print error:', err);
                    router.push('/admin/reports');
                }
            }, 500);

            return () => clearTimeout(printTimeout);
        }
    }, [data, router]);

    useEffect(() => {
        const handlePrintCancel = () => {
            router.push('/admin/reports');
        };

        window.addEventListener('afterprint', handlePrintCancel);

        return () => {
            window.removeEventListener('afterprint', handlePrintCancel);
        };
    }, [router]);

    if (isLoading) return <div>Loading evaluation...</div>;
    if (error) return <div>Error loading evaluation</div>;
    if (!data) return <div>No data available</div>;

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

    return (
        <div ref={componentRef}>
            <div style={styles.header}>
                <h1>Republic of the Philippines</h1>
                <h2>NORTH EASTERN MINDANAO STATE UNIVERSITY</h2>
                <h3>LIANGA CAMPUS</h3>
                <h4>COLLEGE OF INFORMATION TECHNOLOGY EDUCATION</h4>
                <h4>FACULTY EVALUATION REPORT</h4>
            </div>
            <div style={{ marginBottom: '20px' }}>
                <p><strong>Faculty ID:</strong> {data.facultyId}</p>
                <p><strong>Faculty Name:</strong> {data.facultyName}</p>
                <p><strong>Department:</strong> {data.facultyDepartment}</p>
                <p><strong>Total Evaluators:</strong> {data.totalEvaluators}</p>
            </div>

            <h3 style={{ textAlign: 'center' }}>Overall Faculty Evaluation</h3>
            <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'center' as const,
                border: '1px solid black',
            }}>
                <thead>
                    <tr>
                        <th style={styles.cell}>Category</th>
                        <th style={styles.cell}>Average Rating</th>
                        <th style={styles.cell}>Normalized Value</th>
                        <th style={styles.cell}>Weighted Average</th>
                        <th style={styles.cell}>Weight</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(data.facultyBreakdown || {}).map(([category, score]) => (
                        <tr key={category}>
                            <td style={styles.cell}>{category.replace('_', ' ')}</td>
                            <td style={styles.cell}>{score.averageRating}</td>
                            <td style={styles.cell}>{score.normalizedValue}</td>
                            <td style={styles.cell}>{score.weightedAverage}</td>
                            <td style={styles.cell}>{score.weight}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <h3>Total Faculty Score: {data.facultyTotalScore}</h3>
            </div>

            <h3 style={{ textAlign: 'center', marginTop: '20px' }}>Subject-wise Evaluations</h3>
            {data.subjectEvaluations?.map((subject, index) => (
                <div key={index} style={{ marginBottom: '20px' }}>
                    <h4 style={{ textAlign: 'center' }}>{subject.subjectName}</h4>
                    <p style={{ textAlign: 'center' }}>
                        <strong>Total Evaluators:</strong> {subject.totalEvaluators} |
                        <strong> Subject Total Score:</strong> {subject.totalScore}
                    </p>
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        textAlign: 'center' as const,
                        border: '1px solid black',
                    }}>
                        <thead>
                            <tr>
                                <th style={styles.cell}>Category</th>
                                <th style={styles.cell}>Average Rating</th>
                                <th style={styles.cell}>Normalized Value</th>
                                <th style={styles.cell}>Weighted Average</th>
                                <th style={styles.cell}>Weight</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(subject.breakdown || {}).map(([category, score]) => (
                                <tr key={category}>
                                    <td style={styles.cell}>{category.replace('_', ' ')}</td>
                                    <td style={styles.cell}>{score.averageRating}</td>
                                    <td style={styles.cell}>{score.normalizedValue}</td>
                                    <td style={styles.cell}>{score.weightedAverage}</td>
                                    <td style={styles.cell}>{score.weight}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
}