import React from 'react'
import { PageWithBackButton } from '../../../_components/PageWithBackButton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

export function FacultyEditSkeleton() {
    return (
        <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="#">
                                    FACULTY
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>EDIT FACULTY FORM</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>

            <div className='p-4'>
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
            </div>
        </SidebarInset>

    )
}
