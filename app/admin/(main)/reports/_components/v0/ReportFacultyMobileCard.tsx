import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Printer, User, Building2, Star } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FacultyEvaluationResult } from '@/lib/types'
import { Skeleton } from '@/components/ui/skeleton'

export function ReportFacultyTableMobileCards({
    data,
    isLoading
}: {
    data?: FacultyEvaluationResult[],
    isLoading: boolean
}) {
    const router = useRouter()

    const handlePrint = (facultyId: string) => {
        const url = `/print/${facultyId}/result`
        router.push(url)
    };

    const loadingSkeletons = Array(5).fill(0).map((_, index) => (
        <Card key={index} className="mb-4">
            <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                </div>
                <div className="mt-4">
                    <Skeleton className="h-8 w-full" />
                </div>
            </CardContent>
        </Card>
    ))

    if (isLoading) return (
        <div className="space-y-4 md:hidden">
            {loadingSkeletons}
        </div>
    )

    return (
        <div className="space-y-4 md:hidden">
            {data?.map((faculty) => (
                <Card key={faculty.facultyId} className="w-full">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="flex items-center space-x-2">
                            <User className="h-5 w-5 text-muted-foreground" />
                            <CardTitle className="text-sm font-medium">
                                {faculty.facultyName.toUpperCase()}
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                    <strong>Department:</strong> {faculty.facultyDepartment}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Star className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                    <strong>Total Evaluators:</strong> {faculty.totalEvaluators}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Star className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                    <strong>Total Score:</strong> {faculty.totalScore}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                        <Button
                            onClick={() => handlePrint(faculty.facultyId)}
                            disabled={!faculty.totalEvaluators || !faculty.totalScore}
                            className="w-full"
                        >
                            <Printer className="mr-2 h-4 w-4" />
                            Print Result
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}