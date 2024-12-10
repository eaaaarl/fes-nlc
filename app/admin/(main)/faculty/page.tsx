"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileDown, UserPlus } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import FacultyTableData from './_components/FacultyTableData'



export default function FacultyPage() {



    return (
        <>
            <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-semibold md:text-2xl">
                        Faculty Management
                    </h1>
                    <div className='flex gap-4'>

                        <Link href="/admin/faculty/add">
                            <Button className="flex items-center gap-2">
                                <UserPlus className="h-4 w-4" />
                                Add Faculty
                            </Button>
                        </Link>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Faculty List</CardTitle>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <FacultyTableData />
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

