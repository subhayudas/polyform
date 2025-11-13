import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Package, Clock, CheckCircle, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface DashboardStatsProps {
  summary: {
    totalOrders: number;
    activeOrders: number;
    completedOrders: number;
    totalSpent: number;
  };
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ summary }) => {
  const completionRate = summary.totalOrders > 0 
    ? (summary.completedOrders / summary.totalOrders) * 100 
    : 0;
  
  const activeRate = summary.totalOrders > 0 
    ? (summary.activeOrders / summary.totalOrders) * 100 
    : 0;

  const stats = [
    {
      title: 'Total Orders',
      value: summary.totalOrders,
      icon: Package,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      iconBg: 'bg-primary/20',
      change: null,
    },
    {
      title: 'Active Orders',
      value: summary.activeOrders,
      icon: Clock,
      color: 'text-primary',
      bgColor: 'bg-primary/15',
      iconBg: 'bg-primary/25',
      change: activeRate.toFixed(1) + '%',
      progress: activeRate,
    },
    {
      title: 'Completed',
      value: summary.completedOrders,
      icon: CheckCircle,
      color: 'text-primary',
      bgColor: 'bg-primary/20',
      iconBg: 'bg-primary/30',
      change: completionRate.toFixed(1) + '%',
      progress: completionRate,
    },
    {
      title: 'Total Spent',
      value: `$${summary.totalSpent.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-primary',
      bgColor: 'bg-primary/25',
      iconBg: 'bg-primary/35',
      change: null,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className={cn("overflow-hidden transition-all hover:shadow-lg", stat.bgColor)}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={cn("p-3 rounded-lg", stat.iconBg)}>
                  <Icon className={cn("w-6 h-6", stat.color)} />
                </div>
                {stat.change && (
                  <div className="flex items-center gap-1 text-xs font-medium text-primary/70">
                    <TrendingUp className="w-3 h-3" />
                    {stat.change}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-primary/70">{stat.title}</p>
                <p className={cn("text-3xl font-bold", stat.color)}>{stat.value}</p>
                {stat.progress !== undefined && (
                  <div className="mt-3">
                    <Progress 
                      value={stat.progress} 
                      className="h-2"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardStats;
