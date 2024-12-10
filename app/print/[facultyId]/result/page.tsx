'use client';
import React, { useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

export default function PrintPage() {
    const router = useRouter();
    const params = useParams();
    const componentRef = useRef(null);
    const facultyId = params?.facultyId as string;

    const { data, isLoading, error } = useQuery({
        queryKey: ['faculty-evaluation', facultyId],
        queryFn: async () => {
            const response = await fetch(`/api/admin/evaluation-result/${facultyId}/result`);
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
                <p><strong>Faculty ID:</strong> {data[0].facultyId}</p>
                <p><strong>Faculty Name:</strong> {data[0].facultyName}</p>
                <p><strong>Department:</strong> {data[0].facultyDepartment}</p>
                <p><strong>Subject:</strong> {data[0].subject}</p>
                <p><strong>Evaluation Summary</strong></p>
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
                        <td style={styles.cell}>{data[0].breakdown.COMMITMENT.weightedAverage || 0}</td>
                        <td style={styles.cell}>{data[0].breakdown.KNOWLEDGE_OF_SUBJECT.weightedAverage || 0}</td>
                        <td style={styles.cell}>{data[0].breakdown.TEACHING_FOR_INDEPENDENT_LEARNING.weightedAverage || 0}</td>
                        <td style={styles.cell}>{data[0].breakdown.MANAGEMENT_OF_LEARNING.weightedAverage || 0}</td>
                        <td style={styles.cell}>{data[0].totalScore || 0}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}