import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function FacultyDetailPageSkeleton() {
    return (
        <div className="container mx-auto p-4">
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-3/4 mb-2" />
                </CardHeader>
                <CardContent>
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <Skeleton className="h-6 w-1/2" />
                                <div className="flex space-x-2">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-20" />
                                </div>
                            </div>
                            <div className="grid grid-cols-5 gap-2">
                                {[1, 2, 3, 4, 5].map((col) => (
                                    <Skeleton key={col} className="h-10 w-full" />
                                ))}
                            </div>
                            <div className="mt-4">
                                <Skeleton className="h-10 w-48" />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}