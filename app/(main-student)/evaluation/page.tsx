import React from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import FormEvaluation from './_components/FormEvaluation'
import { ClipboardPen } from 'lucide-react'
import FormMobileEvaluation from './_components/FormMobileEvaluation'

export default function EvaluationPage() {
    return (
        <SidebarInset className="flex flex-col">
            <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                    <BreadcrumbList>
                        {/*<BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink href="#">Evaluation</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="hidden md:block" />*/}
                        <BreadcrumbItem>
                            <BreadcrumbPage className='flex items-center gap-2'>
                                <ClipboardPen />
                                <span>EVALUATION</span>
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className='hidden max-lg:hidden lg:block'>
                    <FormEvaluation />
                </div>
                <div className='lg:hidden'>
                    <FormMobileEvaluation />
                </div>
            </div>
        </SidebarInset>
    )
}
