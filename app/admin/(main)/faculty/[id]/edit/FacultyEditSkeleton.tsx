import React from 'react'
import { PageWithBackButton } from '../../../_components/PageWithBackButton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function FacultyEditSkeleton() {
    return (
        <PageWithBackButton
            backButtonHref='/admin/faculty'
            pageTitle='Edit Faculty'
        >
            <div className='space-y-6 max-w-2xl mx-auto'>
                <Card>
                    <CardHeader>
                        <CardTitle>
                            <Skeleton className="h-8 w-1/2" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-[150px]" />
                                <Skeleton className="h-12 w-full" />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-[100px]" />
                                    <Skeleton className="h-12 w-full" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-[100px]" />
                                    <Skeleton className="h-12 w-full" />
                                </div>
                            </div>
                            <div>
                                <Skeleton className="h-12 w-[120px]" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </PageWithBackButton>
    )
}
