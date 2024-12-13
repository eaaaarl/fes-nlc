import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

export function EvaluationFormSkeleton() {
    return (
        <div className="space-y-6 gap-4 p-4">
            <Card>
                <CardHeader>
                    <CardTitle>
                        <Skeleton className="h-8 w-1/2" />
                    </CardTitle>
                    <CardDescription>
                        <Skeleton className="h-4 w-3/4" />
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-1/4 mb-2" />
                            <Skeleton className="h-10 w-full" />
                        </div>

                        <div className="space-y-2">
                            <Skeleton className="h-4 w-1/4 mb-2" />
                            <Skeleton className="h-10 w-full" />
                        </div>

                        <div className="space-y-2">
                            <Skeleton className="h-4 w-1/4 mb-2" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {[1, 2, 3].map((category) => (
                <div key={category} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                <Skeleton className="h-6 w-1/3" />
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardContent>
                            <div className="space-y-4 p-4">
                                {[1, 2, 3, 4].map((question) => (
                                    <div key={question} className="space-y-2 p-2">
                                        <Skeleton className="h-6 w-full mb-2" />
                                        <div className="flex flex-wrap gap-4 justify-between">
                                            {[1, 2, 3, 4, 5].map((option) => (
                                                <div key={option} className="flex items-center space-x-2">
                                                    <Skeleton className="h-4 w-4 rounded-full" />
                                                    <Skeleton className="h-4 w-16" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ))}

            <Card>
                <CardHeader>
                    <CardTitle>
                        <Skeleton className="h-6 w-1/2" />
                    </CardTitle>
                    <CardDescription>
                        <Skeleton className="h-4 w-3/4" />
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-24 w-full" />
                </CardContent>
            </Card>

            <div className="mt-6">
                <Skeleton className="h-10 w-36" />
            </div>
        </div>
    );
}