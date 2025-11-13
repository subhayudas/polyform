import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Order } from '@/hooks/useOrders';
import { 
  Clock, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Calendar,
  DollarSign,
  Package2,
  Zap,
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
  ArrowRight
} from 'lucide-react';
import { format, parseISO, differenceInDays } from 'date-fns';
import { Progress } from '@/components/ui/progress';

interface DashboardInsightsProps {
  orders: Order[];
}

const DashboardInsights: React.FC<DashboardInsightsProps> = ({ orders }) => {
  const [hoveredInsight, setHoveredInsight] = useState<string | null>(null);
  const [expandedAlert, setExpandedAlert] = useState<boolean>(false);

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

    // Average processing time
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

  const insightCards = [
    {
      id: 'recent',
      title: 'Recent Activity',
      value: insights.recentOrders,
      subtitle: 'Last 7 days',
      icon: Calendar,
      trend: +12
    },
    {
      id: 'revenue',
      title: 'Monthly Revenue',
      value: `$${insights.last30DaysRevenue.toFixed(0)}`,
      subtitle: insights.revenueGrowth !== 0 
        ? `${insights.revenueGrowth > 0 ? '+' : ''}${insights.revenueGrowth.toFixed(1)}% from last month`
        : 'No previous data',
      icon: DollarSign,
      trend: insights.revenueGrowth
    },
    {
      id: 'active',
      title: 'Active Value',
      value: `$${insights.activeOrdersValue.toFixed(0)}`,
      subtitle: `${insights.activeOrders} in progress`,
      icon: Package2,
      trend: +8
    },
    {
      id: 'time',
      title: 'Avg Time',
      value: `${Math.round(insights.avgProcessingTime)}d`,
      subtitle: 'Processing time',
      icon: Clock,
      trend: -2
    },
    {
      id: 'material',
      title: 'Top Material',
      value: insights.mostPopularMaterial,
      subtitle: 'Most used',
      icon: Zap,
      trend: null
    },
    {
      id: 'priority',
      title: 'High Priority',
      value: insights.highPriorityOrders,
      subtitle: 'Urgent orders',
      icon: AlertCircle,
      trend: null,
      alert: insights.highPriorityOrders > 0
    }
  ];

  if (orders.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Insight Cards Grid */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {insightCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.id}
              className={`relative p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                hoveredInsight === card.id
                  ? 'border-gray-300 bg-gray-50'
                  : 'border-gray-200 hover:border-gray-300'
              } ${card.alert ? 'border-primary/30 bg-primary/10' : ''}`}
              onMouseEnter={() => setHoveredInsight(card.id)}
              onMouseLeave={() => setHoveredInsight(null)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  card.alert ? 'bg-primary/15' : 'bg-primary/10'
                }`}>
                  <Icon className={`w-4 h-4 ${card.alert ? 'text-primary' : 'text-primary/70'}`} />
                </div>
                {card.trend !== null && (
                  <div className={`ml-auto flex items-center text-xs ${
                    card.trend > 0 ? 'text-primary' : card.trend < 0 ? 'text-primary/70' : 'text-primary/60'
                  }`}>
                    {card.trend > 0 ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : card.trend < 0 ? (
                      <ChevronDown className="w-3 h-3" />
                    ) : null}
                    {card.trend !== 0 && `${Math.abs(card.trend).toFixed(0)}%`}
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">{card.title}</p>
                <p className={`text-xl font-bold mb-1 ${
                  card.alert ? 'text-primary' : 'text-primary'
                } ${typeof card.value === 'string' && card.value.length > 10 ? 'text-sm' : ''}`}>
                  {card.value}
                </p>
                <p className="text-xs text-gray-500">{card.subtitle}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Alerts Section */}
      {(insights.overdueOrders > 0 || insights.highPriorityOrders > 0) && (
        <motion.div
          className="border-l-2 border-l-primary bg-primary/10 rounded-lg p-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-primary" />
              <h4 className="font-medium text-primary">Attention Required</h4>
            </div>
            <button
              onClick={() => setExpandedAlert(!expandedAlert)}
              className="p-1 hover:bg-primary/15 rounded transition-colors"
            >
              <MoreHorizontal className="w-4 h-4 text-primary" />
            </button>
          </div>
          <div className="space-y-2">
            {insights.overdueOrders > 0 && (
              <motion.div 
                className="flex items-center justify-between p-2 bg-white rounded-lg"
                whileHover={{ x: 4 }}
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-gray-700">Overdue Orders</span>
                </div>
                <span className="font-bold text-orange-600">{insights.overdueOrders}</span>
              </motion.div>
            )}
            {insights.highPriorityOrders > 0 && (
              <motion.div 
                className="flex items-center justify-between p-2 bg-white rounded-lg"
                whileHover={{ x: 4 }}
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-gray-700">High Priority</span>
                </div>
                <span className="font-bold text-primary">{insights.highPriorityOrders}</span>
              </motion.div>
            )}
          </div>
          {expandedAlert && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
              className="pt-3 border-t border-primary/20"
            >
              <p className="text-sm text-primary/80">
                Review these orders to ensure timely delivery and customer satisfaction.
              </p>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Performance Overview */}
      <motion.div
        className="border-b border-gray-100 pb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Performance Overview</h3>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreHorizontal className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Completion Rate</span>
              <span className="text-sm font-bold text-gray-900">
                {insights.completionRate.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="h-2 rounded-full bg-gray-900"
                initial={{ width: 0 }}
                animate={{ width: `${insights.completionRate}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            <motion.div 
              className="text-center p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <p className="text-2xl font-bold text-primary">{insights.activeOrders}</p>
              <p className="text-xs text-gray-600 mt-1">Active Orders</p>
            </motion.div>
            <motion.div 
              className="text-center p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <p className="text-2xl font-bold text-green-600">{insights.completedOrders}</p>
              <p className="text-xs text-gray-600 mt-1">Completed</p>
            </motion.div>
            <motion.div 
              className="text-center p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <p className="text-2xl font-bold text-orange-600">{insights.overdueOrders}</p>
              <p className="text-xs text-gray-600 mt-1">Overdue</p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardInsights;
