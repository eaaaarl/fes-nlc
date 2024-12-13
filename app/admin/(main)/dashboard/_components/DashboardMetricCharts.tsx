import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DashboardChartProps {
    stats: {
        totalUsers: number;
        totalFaculty: number;
        totalStudents: number;
        totalSubjects: number;
        totalEvaluated: number;
        activeUsers: number;
    }
}

export const DashboardMetricsChart: React.FC<DashboardChartProps> = ({ stats }) => {
    // Transform stats into chart-friendly format
    const chartData = [
        {
            name: 'Users',
            Total: stats.totalUsers,
            Faculty: stats.totalFaculty,
            Students: stats.totalStudents,
            Active: stats.activeUsers
        },
        {
            name: 'Academic',
            Total: stats.totalSubjects,
            Evaluated: stats.totalEvaluated
        }
    ]

    return (
        <Card className="w-full h-[400px]">
            <CardHeader>
                <CardTitle>Academic Metrics Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#f9fafb', borderRadius: '8px' }}
                            labelStyle={{ fontWeight: 'bold' }}
                        />
                        <Legend />
                        <Bar dataKey="Total" fill="#8884d8" />
                        <Bar dataKey="Faculty" fill="#82ca9d" />
                        <Bar dataKey="Students" fill="#ffc658" />
                        <Bar dataKey="Active" fill="#ff7300" />
                        <Bar dataKey="Evaluated" fill="#413ea0" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

export default DashboardMetricsChart