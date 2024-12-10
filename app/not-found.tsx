"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotFoundPage() {
    const router = useRouter();
    return (
        <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-white">
            <div className="text-center max-w-md">
                <h1 className="text-6xl font-bold tracking-tight">404</h1>
                <p className="mt-4 text-lg">
                    Oops! The page you're looking for doesn't exist.
                </p>
                <p className="mt-2 text-sm text-gray-400">
                    It might have been removed or never existed in the first place.
                </p>
                <div className="mt-6 flex justify-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="px-6 py-3 text-base font-medium text-gray-900 bg-gradient-to-r from-red-400 to-pink-500 rounded-lg shadow-md hover:from-red-500 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        Go Back
                    </button>
                    {/* 
                    <Link
                        href="/"
                        className="inline-block px-6 py-3 text-base font-medium text-gray-900 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg shadow-md hover:from-green-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        Go to Home
                    </Link> */}
                </div>
                <div className="mt-8 text-gray-400">
                    <p>If you think this is an error, please contact support.</p>
                </div>
            </div>
        </div>
    );
}
