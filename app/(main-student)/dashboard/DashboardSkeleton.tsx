import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
    return (
        <SidebarInset className="flex flex-col">
            <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
                <SidebarTrigger className="-ml-1">
                    <Skeleton className="w-8 h-8 rounded-full" />
                </SidebarTrigger>
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem className="hidden md:block">
                            <Skeleton className="h-4 w-20" />
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="hidden md:block" />
                        <BreadcrumbItem>
                            <Skeleton className="h-4 w-16" />
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </header>

            <div className="space-y-4 gap-4 p-4">
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-5 w-48" />
            </div>

            <div className='flex flex-1 flex-col gap-4 p-4 pt-4'>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((_, index) => (
                        <Card
                            key={index}
                            className="animate-pulse hover:shadow-lg transition-shadow"
                        >
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-6 w-6 rounded-full" />
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Skeleton className="h-7 w-24" />
                                <Skeleton className="h-4 w-36" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </SidebarInset>
    )
}