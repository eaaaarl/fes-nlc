'use client';

import React, { useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

function SubjectPrintContent() {
    const router = useRouter();
    const searchQuery = useSearchParams();
    const componentRef = useRef(null);
    const facultyId = searchQuery.get('facultyId') as string;
    const subjectName = searchQuery.get('subjectName') as string;

    const { data, isLoading } = useQuery({
        queryKey: ['faculty-subject-evaluation', facultyId, subjectName],
        queryFn: async () => {
            const response = await fetch(`/api/admin/evaluation-result/v2/subject?facultyId=${facultyId}&subjectName=${subjectName}`);
            if (!response.ok) {
                throw new Error('Failed to fetch subject evaluation');
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
                    router.push(`/admin/reports/${facultyId}/details`);
                }
            }, 500);

            return () => clearTimeout(printTimeout);
        }
    }, [data, router, facultyId]);

    useEffect(() => {
        const handlePrintCancel = () => {
            router.push(`/admin/reports/${facultyId}/details`);
        };

        window.addEventListener('afterprint', handlePrintCancel);

        return () => {
            window.removeEventListener('afterprint', handlePrintCancel);
        };
    }, [router, facultyId]);

    if (isLoading) return <div>Loading evaluation...</div>;
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
            </div>
            <div style={{ marginBottom: '20px' }}>
                <p><strong>Faculty ID:</strong> {data.facultyId}</p>
                <p><strong>Faculty Name:</strong> {data.facultyName}</p>
                <p><strong>Department:</strong> {data.facultyDepartment}</p>
                <p><strong>Subject:</strong> {data.subjectName}</p>
                <p><strong>Total Evaluators:</strong> {data.totalEvaluators}</p>
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
                        <td style={styles.cell}>{data.breakdown.COMMITMENT.weightedAverage || 0}</td>
                        <td style={styles.cell}>{data.breakdown.KNOWLEDGE_OF_SUBJECT.weightedAverage || 0}</td>
                        <td style={styles.cell}>{data.breakdown.TEACHING_FOR_INDEPENDENT_LEARNING.weightedAverage || 0}</td>
                        <td style={styles.cell}>{data.breakdown.MANAGEMENT_OF_LEARNING.weightedAverage || 0}</td>
                        <td style={styles.cell}>{data.totalScore || 0}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default function SubjectPrintPage() {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <SubjectPrintContent />
        </React.Suspense>
    );
}
