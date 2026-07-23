import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import React from 'react';



const StatCard = ({
  title,
  value,
  change,
  icon: Icon,
  prefix = '',
}: {
  title: string;
  value: string | number;
  change: number;
  icon: React.ComponentType<{ className?: string }>;
  prefix?: string;
}) => {
  const isPositive = change > 0;

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30 dark:from-blue-950/30 dark:to-purple-950/30" />

      <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {title}
        </CardTitle>

        <div className="p-2 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-sm">
          <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </div>
      </CardHeader>

      <CardContent className="relative">
        <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {prefix}
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <div
            className={`flex items-center space-x-1 px-2 py-1 rounded-full ${
              isPositive
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                : 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
            }`}
          >
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            <span className="font-medium">
              {isPositive ? '+' : ''}
              {change}%
            </span>
          </div>

          <span className="text-gray-500 dark:text-gray-400">
            từ tháng trước
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
