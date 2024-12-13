import React from 'react'
import {
    ArrowUpRight,
    TrendingUp,
    TrendingDown
} from 'lucide-react'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface EnhancedStatCardProps {
    icon: React.ElementType;
    title: string;
    value: number | string;
    bgColor?: string;
    iconBg?: string;
    textColor?: string;
    trend?: 'up' | 'down' | 'neutral';
    trendPercentage?: number;
    description?: string;
}

export const EnhancedStatCard: React.FC<EnhancedStatCardProps> = ({
    icon: Icon,
    title,
    value,
    bgColor = "bg-white",
    iconBg = "bg-gray-100",
    textColor = "text-gray-800",
    trend = 'neutral',
    trendPercentage = 0,
    description
}) => {
    const getTrendIcon = () => {
        switch (trend) {
            case 'up':
                return <TrendingUp className="text-green-500 w-4 h-4" />;
            case 'down':
                return <TrendingDown className="text-red-500 w-4 h-4" />;
            default:
                return null;
        }
    }

    const getTrendColor = () => {
        switch (trend) {
            case 'up': return 'text-green-600';
            case 'down': return 'text-red-600';
            default: return 'text-gray-500';
        }
    }

    return (
        <Card className={`${bgColor} border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group`}>
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <div className={`${iconBg} p-3 rounded-xl`}>
                        <Icon className={`h-6 w-6 ${textColor}`} />
                    </div>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <ArrowUpRight className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{description || 'Additional information'}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </CardHeader>
            <CardContent>
                <CardTitle className="text-sm font-medium text-gray-500 mb-2">{title}</CardTitle>
                <div className="flex items-center space-x-2">
                    <p className={`text-3xl font-bold ${textColor}`}>
                        {typeof value === 'number' ? value.toLocaleString() : value}
                    </p>
                    {trendPercentage !== 0 && (
                        <div className="flex items-center space-x-1">
                            {getTrendIcon()}
                            <span className={`text-sm ${getTrendColor()}`}>
                                {Math.abs(trendPercentage)}%
                            </span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default EnhancedStatCard