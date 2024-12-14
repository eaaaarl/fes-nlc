import React from 'react'
import { TrendingUp } from "lucide-react"
import {
    Bar,
    BarChart,
    CartesianGrid,
    LabelList,
    XAxis
} from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

interface DashboardStats {
    totalUsers: number;
    totalFaculty: number;
    totalStudents: number;
    totalSubjects: number;
    totalEvaluated: number;
    currentSemester: string;
    activeUsers: number;
}

const COLOR_MAP = {
    totalUsers: "hsl(var(--chart-1))",
    totalFaculty: "hsl(var(--chart-2))",
    totalStudents: "hsl(var(--chart-3))",
    totalSubjects: "hsl(var(--chart-4))",
    totalEvaluated: "hsl(var(--chart-5))",
    activeUsers: "hsl(var(--chart-6))"
}

export function DashboardChartData({ stats }: { stats: DashboardStats }) {
    const chartData = Object.entries(stats)
        .filter(([key]) => key !== 'currentSemester')
        .map(([key, value]) => ({
            category: key
                .replace('total', '')
                .replace(/([A-Z])/g, ' $1')
                .trim(),
            value: value,
            color: COLOR_MAP[key as keyof typeof COLOR_MAP]
        }))

    const chartConfig = {
        value: {
            label: "Count",
            color: "hsl(var(--chart-1))",
        },
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>System Statistics Overview</CardTitle>
                <CardDescription>{stats.currentSemester}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            top: 20,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar
                            dataKey="value"
                            fill="var(--color-desktop)"
                            radius={8}
                        >
                            <LabelList
                                position="top"
                                offset={12}
                                className="fill-foreground"
                                fontSize={12}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                    System Overview <TrendingUp className="h-4 w-4" />
                </div>
            </CardFooter>
        </Card>
    )
}

export default DashboardChartData