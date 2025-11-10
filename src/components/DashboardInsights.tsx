import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Order } from '@/hooks/useOrders';
import { 
  Clock, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Calendar,
  DollarSign,
  Package2,
  Zap
} from 'lucide-react';
import { format, parseISO, differenceInDays } from 'date-fns';
import { Progress } from '@/components/ui/progress';

interface DashboardInsightsProps {
  orders: Order[];
}

const DashboardInsights: React.FC<DashboardInsightsProps> = ({ orders }) => {
  const insights = useMemo(() => {
    const now = new Date();
    
    // Recent orders (last 7 days)
    const recentOrders = orders.filter(order => {
      const orderDate = parseISO(order.created_at);
      return differenceInDays(now, orderDate) <= 7;
    });

    // Orders by status
    const activeOrders = orders.filter(o => 
      ['pending', 'confirmed', 'in_production', 'quality_check'].includes(o.status || '')
    );
    const completedOrders = orders.filter(o => o.status === 'delivered');
    const overdueOrders = orders.filter(order => {
      if (!order.estimated_delivery) return false;
      const deliveryDate = parseISO(order.estimated_delivery);
      return differenceInDays(now, deliveryDate) > 0 && 
             !['delivered', 'cancelled'].includes(order.status || '');
    });

    // Revenue insights
    const last30DaysRevenue = orders
      .filter(o => {
        const orderDate = parseISO(o.created_at);
        return differenceInDays(now, orderDate) <= 30;
      })
      .reduce((sum, o) => sum + (o.price || 0), 0);

    const previous30DaysRevenue = orders
      .filter(o => {
        const orderDate = parseISO(o.created_at);
        const days = differenceInDays(now, orderDate);
        return days > 30 && days <= 60;
      })
      .reduce((sum, o) => sum + (o.price || 0), 0);

    const revenueGrowth = previous30DaysRevenue > 0 
      ? ((last30DaysRevenue - previous30DaysRevenue) / previous30DaysRevenue) * 100 
      : 0;

    // Most popular material
    const materialCounts: Record<string, number> = {};
    orders.forEach(order => {
      const material = order.material || 'Unknown';
      materialCounts[material] = (materialCounts[material] || 0) + 1;
    });
    const mostPopularMaterial = Object.entries(materialCounts)
      .sort((a, b) => b[1] - a[1])[0];

    // Average processing time (for completed orders)
    const completedWithDelivery = completedOrders.filter(o => o.created_at && o.delivered_at);
    const avgProcessingTime = completedWithDelivery.length > 0
      ? completedWithDelivery.reduce((sum, order) => {
          const created = parseISO(order.created_at);
          const delivered = parseISO(order.delivered_at!);
          return sum + differenceInDays(delivered, created);
        }, 0) / completedWithDelivery.length
      : 0;

    // Active orders value
    const activeOrdersValue = activeOrders.reduce((sum, o) => sum + (o.price || 0), 0);

    // Priority orders
    const highPriorityOrders = orders.filter(o => 
      (o.priority === 'high' || o.priority === 'urgent') && 
      !['delivered', 'cancelled'].includes(o.status || '')
    );

    return {
      recentOrders: recentOrders.length,
      activeOrders: activeOrders.length,
      completedOrders: completedOrders.length,
      overdueOrders: overdueOrders.length,
      last30DaysRevenue,
      revenueGrowth,
      mostPopularMaterial: mostPopularMaterial ? mostPopularMaterial[0] : 'None',
      avgProcessingTime,
      activeOrdersValue,
      highPriorityOrders: highPriorityOrders.length,
      completionRate: orders.length > 0 ? (completedOrders.length / orders.length) * 100 : 0
    };
  }, [orders]);

  const getInsightColor = (value: number, isGood: boolean) => {
    if (isGood) {
      return value > 0 ? 'text-green-600' : 'text-red-600';
    }
    return value > 0 ? 'text-red-600' : 'text-green-600';
  };

  const insightCards = [
    {
      title: 'Recent Activity',
      value: `${insights.recentOrders} orders`,
      subtitle: 'Last 7 days',
      icon: Calendar,
      color: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100'
    },
    {
      title: 'Monthly Revenue',
      value: `$${insights.last30DaysRevenue.toFixed(2)}`,
      subtitle: insights.revenueGrowth !== 0 
        ? `${insights.revenueGrowth > 0 ? '+' : ''}${insights.revenueGrowth.toFixed(1)}% from last month`
        : 'No previous data',
      icon: DollarSign,
      color: 'bg-green-50 border-green-200',
      iconColor: insights.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600',
      iconBg: insights.revenueGrowth >= 0 ? 'bg-green-100' : 'bg-red-100',
      trend: insights.revenueGrowth >= 0
    },
    {
      title: 'Active Orders Value',
      value: `$${insights.activeOrdersValue.toFixed(2)}`,
      subtitle: `${insights.activeOrders} orders in progress`,
      icon: Package2,
      color: 'bg-purple-50 border-purple-200',
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-100'
    },
    {
      title: 'Avg Processing Time',
      value: `${Math.round(insights.avgProcessingTime)} days`,
      subtitle: 'For completed orders',
      icon: Clock,
      color: 'bg-orange-50 border-orange-200',
      iconColor: 'text-orange-600',
      iconBg: 'bg-orange-100'
    },
    {
      title: 'Top Material',
      value: insights.mostPopularMaterial,
      subtitle: 'Most frequently used',
      icon: Zap,
      color: 'bg-yellow-50 border-yellow-200',
      iconColor: 'text-yellow-600',
      iconBg: 'bg-yellow-100'
    },
    {
      title: 'High Priority',
      value: insights.highPriorityOrders,
      subtitle: 'Urgent orders pending',
      icon: AlertCircle,
      color: insights.highPriorityOrders > 0 
        ? 'bg-red-50 border-red-200' 
        : 'bg-gray-50 border-gray-200',
      iconColor: insights.highPriorityOrders > 0 ? 'text-red-600' : 'text-gray-600',
      iconBg: insights.highPriorityOrders > 0 ? 'bg-red-100' : 'bg-gray-100'
    }
  ];

  if (orders.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {insightCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className={`${card.color} border transition-all hover:shadow-md`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2.5 rounded-lg ${card.iconBg}`}>
                    <Icon className={`w-5 h-5 ${card.iconColor}`} />
                  </div>
                  {card.trend !== undefined && (
                    <div className={`flex items-center gap-1 ${card.trend ? 'text-green-600' : 'text-red-600'}`}>
                      <TrendingUp className={`w-4 h-4 ${!card.trend ? 'rotate-180' : ''}`} />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{card.value}</p>
                  <p className="text-xs text-gray-500">{card.subtitle}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Alerts Section */}
      {(insights.overdueOrders > 0 || insights.highPriorityOrders > 0) && (
        <Card className="border-l-4 border-l-orange-500 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-900">
              <AlertCircle className="w-5 h-5" />
              Attention Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {insights.overdueOrders > 0 && (
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Overdue Orders
                    </span>
                  </div>
                  <span className="font-bold text-orange-600">
                    {insights.overdueOrders}
                  </span>
                </div>
              )}
              {insights.highPriorityOrders > 0 && (
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-gray-700">
                      High Priority Orders
                    </span>
                  </div>
                  <span className="font-bold text-red-600">
                    {insights.highPriorityOrders}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Overview */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Completion Rate</span>
                <span className="text-sm font-bold text-gray-900">
                  {insights.completionRate.toFixed(1)}%
                </span>
              </div>
              <Progress value={insights.completionRate} className="h-2" />
            </div>
            
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{insights.activeOrders}</p>
                <p className="text-xs text-gray-600 mt-1">Active</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{insights.completedOrders}</p>
                <p className="text-xs text-gray-600 mt-1">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">{insights.overdueOrders}</p>
                <p className="text-xs text-gray-600 mt-1">Overdue</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardInsights;

