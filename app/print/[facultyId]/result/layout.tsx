import { Metadata } from 'next';
import React, { ReactNode } from 'react'


export const metadata: Metadata = {
    title: "EVALUATION RESULT",
};

export default function PrintLayout({ children }: { children: ReactNode }) {
    return (
        <div className="print-layout min-h-screen p-4 print:p-0 print:m-0">
            <div className="print-container max-w-4xl mx-auto">
                {children}
            </div>
        </div>
    )
}