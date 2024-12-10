"use client";

import { useRouter } from 'next/navigation';

export default function UnauthorizedPage() {
    const router = useRouter();

    return (
        <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-white">
            <div className="text-center max-w-md">
                <h1 className="text-6xl font-bold tracking-tight">401</h1>
                <p className="mt-4 text-lg">
                    Unauthorized Access
                </p>
                <p className="mt-2 text-sm text-gray-400">
                    You do not have permission to view this page.
                </p>
                <div className="mt-6 flex justify-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="px-6 py-3 text-base font-medium text-gray-900 bg-gradient-to-r from-red-400 to-pink-500 rounded-lg shadow-md hover:from-red-500 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        Go Back
                    </button>
                </div>
                <div className="mt-8 text-gray-400">
                    <p>If you believe this is an error, please contact support.</p>
                </div>
            </div>
        </div>
    );
}