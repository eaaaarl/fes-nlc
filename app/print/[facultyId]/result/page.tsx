'use client'

import React, { useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Loader } from 'lucide-react';

export default function PrintPage() {
    const router = useRouter();
    const params = useParams();
    const componentRef = useRef(null);
    const facultyId = params?.facultyId as string;

    const { data, isLoading } = useQuery({
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

    if (isLoading) return <Loader className='h-8 w-8 animate-spin' />;

    // Ensure data exists and is an array before accessing
    if (!data || data.length === 0) {
        return <div>No evaluation data available</div>;
    }

    return (
        <div ref={componentRef}>
            <div style={styles.header}>
                <h1>Republic of the Philippines</h1>
                <h2>NORTH EASTERN MINDANAO STATE UNIVERSITY</h2>
                <h3>LIANGA CAMPUS</h3>
            </div>
            <div style={{ marginBottom: '20px' }}>
                <p><strong>Faculty Name:</strong> {data[0].facultyName}</p>
                <p><strong>Department:</strong> {data[0].facultyDepartment}</p>
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
                        <td style={styles.cell}>{data[0].breakdown['KNOWLEDGE OF SUBJECT'].weightedAverage || 0}</td>
                        <td style={styles.cell}>{data[0].breakdown['MANAGEMENT OF LEARNING'].weightedAverage || 0}</td>
                        <td style={styles.cell}>{data[0].breakdown['TEACHING FOR INDEPENDENT LEARNING'].weightedAverage || 0}</td>
                        <td style={styles.cell}>{data[0].totalScore || 0}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}