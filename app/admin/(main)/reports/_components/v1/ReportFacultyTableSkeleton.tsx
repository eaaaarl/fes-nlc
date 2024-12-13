import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";

export function ReportFacultyTableSkeleton() {
    return (
        <div className="space-y-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Total Evaluator</TableHead>
                        <TableHead>Total Score</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[1, 2, 3, 4, 5].map((row) => (
                        <TableRow key={row}>
                            <TableCell>
                                <Skeleton className="h-4 w-3/4" />
                            </TableCell>
                            <TableCell>
                                <Skeleton className="h-4 w-1/2" />
                            </TableCell>
                            <TableCell>
                                <Skeleton className="h-4 w-1/4" />
                            </TableCell>
                            <TableCell>
                                <Skeleton className="h-4 w-1/4" />
                            </TableCell>
                            <TableCell>
                                <Skeleton className="h-8 w-8 rounded-md" />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}