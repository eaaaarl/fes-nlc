import { env } from '@/lib/env';
import { Metadata } from 'next';
import React, { ReactNode } from 'react'

export async function generateMetadata({
    params,
}: {
    params: Promise<{ facultyId: string }>;
}): Promise<Metadata> {
    const { facultyId } = await params;
    try {
        const response = await fetch(`${env.NEXT_PUBLIC_SITE_URL}/api/admin/evaluation-result/${facultyId}/result`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch faculty data');
        }
        const data = await response.json();
        return {
            title: `Faculty - ${data[0]?.facultyName || 'Faculty'} - 2024-2025`,
        };
    } catch (error) {
        console.error('Metadata Fetch Error:', error);
        return {
            title: 'Faculty Evaluation',
        };
    }
}

export default function PrintLayout({ children }: { children: ReactNode }) {
    return (
        <div className="print-layout min-h-screen p-4 print:p-0 print:m-0">
            <div className="print-container max-w-4xl mx-auto">
                {children}
            </div>
        </div>
    )
}