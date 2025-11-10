import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Order } from '@/hooks/useOrders';
import { format, parseISO, startOfMonth, subMonths } from 'date-fns';
import { TrendingUp, DollarSign, Package, Activity } from 'lucide-react';

interface DashboardChartsProps {
  orders: Order[];
}

const COLORS = {
  pending: '#FFA500',
  confirmed: '#3B82F6',
  in_production: '#8B5CF6',
  quality_check: '#EC4899',
  shipped: '#10B981',
  delivered: '#22C55E',
  cancelled: '#EF4444',
  on_hold: '#6B7280',
};

const STATUS_COLORS = Object.values(COLORS);

const DashboardCharts: React.FC<DashboardChartsProps> = ({ orders }) => {
  // Process data for orders over time
  const ordersOverTime = useMemo(() => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(new Date(), 5 - i);
      return {
        month: format(startOfMonth(date), 'MMM yyyy'),
        orders: 0,
        revenue: 0,
      };
    });

    orders.forEach((order) => {
      const orderDate = parseISO(order.created_at);
      const monthKey = format(startOfMonth(orderDate), 'MMM yyyy');
      const monthData = last6Months.find((m) => m.month === monthKey);
      
      if (monthData) {
        monthData.orders += 1;
        monthData.revenue += order.price || 0;
      }
    });

    return last6Months;
  }, [orders]);

  // Process data for order status distribution
  const statusDistribution = useMemo(() => {
    const distribution: Record<string, number> = {};
    
    orders.forEach((order) => {
      const status = order.status || 'pending';
      distribution[status] = (distribution[status] || 0) + 1;
    });

    return Object.entries(distribution).map(([status, count]) => ({
      name: status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      value: count,
      color: COLORS[status as keyof typeof COLORS] || '#6B7280',
    }));
  }, [orders]);

  // Process data for material usage
  const materialUsage = useMemo(() => {
    const usage: Record<string, { count: number; revenue: number }> = {};
    
    orders.forEach((order) => {
      const material = order.material || 'Unknown';
      if (!usage[material]) {
        usage[material] = { count: 0, revenue: 0 };
      }
      usage[material].count += order.quantity;
      usage[material].revenue += order.price || 0;
    });

    return Object.entries(usage)
      .map(([material, data]) => ({
        material,
        count: data.count,
        revenue: data.revenue,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8); // Top 8 materials
  }, [orders]);

  // Process data for average order value over time
  const avgOrderValueTrend = useMemo(() => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(new Date(), 5 - i);
      return {
        month: format(startOfMonth(date), 'MMM yyyy'),
        avgValue: 0,
        totalValue: 0,
        count: 0,
      };
    });

    orders.forEach((order) => {
      const orderDate = parseISO(order.created_at);
      const monthKey = format(startOfMonth(orderDate), 'MMM yyyy');
      const monthData = last6Months.find((m) => m.month === monthKey);
      
      if (monthData && order.price) {
        monthData.totalValue += order.price;
        monthData.count += 1;
      }
    });

    return last6Months.map((month) => ({
      month: month.month,
      avgValue: month.count > 0 ? month.totalValue / month.count : 0,
    }));
  }, [orders]);

  // Calculate key metrics
  const totalRevenue = orders.reduce((sum, order) => sum + (order.price || 0), 0);
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  const completionRate = orders.length > 0 
    ? (orders.filter(o => o.status === 'delivered').length / orders.length) * 100 
    : 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' && entry.name.toLowerCase().includes('revenue') || entry.name.toLowerCase().includes('value')
                ? `$${entry.value.toFixed(2)}`
                : Math.round(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (orders.length === 0) {
    return (
      <Card className="border-2 border-dashed">
        <CardContent className="p-12 text-center">
          <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Data Available</h3>
          <p className="text-gray-600">
            Create some orders to see analytics and insights here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-blue-900">
                  ${totalRevenue.toFixed(2)}
                </p>
              </div>
              <DollarSign className="w-10 h-10 text-blue-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 mb-1">Avg Order Value</p>
                <p className="text-3xl font-bold text-green-900">
                  ${avgOrderValue.toFixed(2)}
                </p>
              </div>
              <TrendingUp className="w-10 h-10 text-green-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 mb-1">Completion Rate</p>
                <p className="text-3xl font-bold text-purple-900">
                  {completionRate.toFixed(1)}%
                </p>
              </div>
              <Package className="w-10 h-10 text-purple-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders Over Time */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Orders Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ordersOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                />
                <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', r: 5 }}
                  activeDot={{ r: 7 }}
                  name="Orders"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Over Time */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={ordersOverTime}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                />
                <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10B981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  name="Revenue ($)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Order Status Distribution */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-purple-600" />
              Order Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Material Usage */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              Top Materials by Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={materialUsage}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="material" 
                  tick={{ fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  stroke="#6b7280"
                />
                <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="count" fill="#F59E0B" name="Quantity" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Average Order Value Trend */}
        <Card className="shadow-lg lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              Average Order Value Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={avgOrderValueTrend}>
                <defs>
                  <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                />
                <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="avgValue"
                  stroke="#6366F1"
                  strokeWidth={3}
                  dot={{ fill: '#6366F1', r: 6 }}
                  activeDot={{ r: 8 }}
                  name="Avg Value ($)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardCharts;

