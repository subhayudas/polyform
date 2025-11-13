import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
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
  ResponsiveContainer,
} from 'recharts';
import { Order } from '@/hooks/useOrders';
import { format, parseISO, startOfMonth, subMonths } from 'date-fns';
import { TrendingUp, DollarSign, Package, Activity, ChevronUp, ChevronDown, MoreHorizontal } from 'lucide-react';

interface DashboardChartsProps {
  orders: Order[];
}

// Green color variations for single color tone
const getGreenShade = (opacity: number, lightness: number = 25) => {
  // Base green: hsl(142, 45%, 25%) - convert to RGB for charts
  // Using variations of the primary green color
  const hue = 142;
  const saturation = 45;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

const COLORS = {
  pending: getGreenShade(0.1, 30),
  confirmed: getGreenShade(0.15, 35),
  in_production: getGreenShade(0.2, 40),
  quality_check: getGreenShade(0.25, 45),
  shipped: getGreenShade(0.3, 50),
  delivered: getGreenShade(0.35, 55),
  cancelled: getGreenShade(0.05, 20),
  on_hold: getGreenShade(0.08, 25),
};

const DashboardCharts: React.FC<DashboardChartsProps> = ({ orders }) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);

  // Process data for orders over time
  const ordersOverTime = useMemo(() => {
    const monthsToShow = selectedTimeRange === 'week' ? 1 : selectedTimeRange === 'month' ? 6 : 12;
    const timeData = Array.from({ length: monthsToShow }, (_, i) => {
      const date = subMonths(new Date(), monthsToShow - 1 - i);
      return {
        month: selectedTimeRange === 'week' 
          ? format(date, 'MMM d')
          : format(startOfMonth(date), 'MMM yyyy'),
        orders: 0,
        revenue: 0,
      };
    });

    orders.forEach((order) => {
      const orderDate = parseISO(order.created_at);
      const monthKey = selectedTimeRange === 'week'
        ? format(orderDate, 'MMM d')
        : format(startOfMonth(orderDate), 'MMM yyyy');
      const monthData = timeData.find((m) => m.month === monthKey);
      
      if (monthData) {
        monthData.orders += 1;
        monthData.revenue += order.price || 0;
      }
    });

    return timeData;
  }, [orders, selectedTimeRange]);

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
      color: COLORS[status as keyof typeof COLORS] || getGreenShade(0.08, 25),
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
      .slice(0, 8);
  }, [orders]);

  // Calculate key metrics
  const totalRevenue = orders.reduce((sum, order) => sum + (order.price || 0), 0);
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  const completionRate = orders.length > 0 
    ? (orders.filter(o => o.status === 'delivered').length / orders.length) * 100 
    : 0;

  // Calculate growth metrics
  const lastMonthOrders = orders.filter(o => {
    const orderDate = parseISO(o.created_at);
    const daysAgo = Math.floor((Date.now() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysAgo <= 30;
  }).length;

  const previousMonthOrders = orders.filter(o => {
    const orderDate = parseISO(o.created_at);
    const daysAgo = Math.floor((Date.now() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysAgo > 30 && daysAgo <= 60;
  }).length;

  const ordersGrowth = previousMonthOrders > 0 
    ? ((lastMonthOrders - previousMonthOrders) / previousMonthOrders) * 100 
    : 0;

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-primary/20 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-primary">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm text-primary/70">
              {entry.name}: {typeof entry.value === 'number' && (entry.name.toLowerCase().includes('revenue') || entry.name.toLowerCase().includes('value'))
                ? `$${entry.value.toFixed(2)}`
                : Math.round(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-primary/20 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-primary">{payload[0].name}</p>
          <p className="text-sm text-primary/70">
            {`${payload[0].value} orders`}
          </p>
        </div>
      );
    }
    return null;
  };

  if (orders.length === 0) {
    return (
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Activity className="w-12 h-12 text-primary/30 mx-auto mb-4" />
        </motion.div>
        <h4 className="text-lg font-medium text-primary mb-2">No Data Available</h4>
        <p className="text-primary/70">Create some orders to see analytics and insights here.</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Key Metrics Row */}
      <motion.div
        className="grid grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="text-center p-4 rounded-lg cursor-pointer transition-all duration-200"
          onMouseEnter={() => setHoveredMetric('revenue')}
          onMouseLeave={() => setHoveredMetric(null)}
          whileHover={{ scale: 1.02, backgroundColor: 'hsl(142, 15%, 98%)' }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div 
            className="text-2xl font-semibold text-primary"
            animate={{ 
              scale: hoveredMetric === 'revenue' ? 1.1 : 1,
              color: hoveredMetric === 'revenue' ? 'hsl(142, 45%, 25%)' : 'hsl(142, 15%, 15%)'
            }}
          >
            ${totalRevenue.toFixed(0)}
          </motion.div>
          <div className="text-sm text-primary/60">Total Revenue</div>
          <motion.div 
            className="flex items-center justify-center mt-1"
            animate={{ y: hoveredMetric === 'revenue' ? -2 : 0 }}
          >
            <ChevronUp className="w-4 h-4 text-primary" />
            <span className="text-xs text-primary">+{Math.abs(ordersGrowth).toFixed(0)}%</span>
          </motion.div>
        </motion.div>

        <motion.div 
          className="text-center p-4 rounded-lg cursor-pointer transition-all duration-200"
          onMouseEnter={() => setHoveredMetric('avg')}
          onMouseLeave={() => setHoveredMetric(null)}
          whileHover={{ scale: 1.02, backgroundColor: 'hsl(142, 15%, 98%)' }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div 
            className="text-2xl font-semibold text-primary"
            animate={{ 
              scale: hoveredMetric === 'avg' ? 1.1 : 1,
              color: hoveredMetric === 'avg' ? 'hsl(142, 45%, 25%)' : 'hsl(142, 15%, 15%)'
            }}
          >
            ${avgOrderValue.toFixed(0)}
          </motion.div>
          <div className="text-sm text-primary/60">Avg Order Value</div>
          <motion.div 
            className="flex items-center justify-center mt-1"
            animate={{ y: hoveredMetric === 'avg' ? -2 : 0 }}
          >
            <ChevronUp className="w-4 h-4 text-primary" />
            <span className="text-xs text-primary">+5%</span>
          </motion.div>
        </motion.div>

        <motion.div 
          className="text-center p-4 rounded-lg cursor-pointer transition-all duration-200"
          onMouseEnter={() => setHoveredMetric('completion')}
          onMouseLeave={() => setHoveredMetric(null)}
          whileHover={{ scale: 1.02, backgroundColor: 'hsl(142, 15%, 98%)' }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div 
            className="text-2xl font-semibold text-primary"
            animate={{ 
              scale: hoveredMetric === 'completion' ? 1.1 : 1,
              color: hoveredMetric === 'completion' ? 'hsl(142, 45%, 25%)' : 'hsl(142, 15%, 15%)'
            }}
          >
            {completionRate.toFixed(0)}%
          </motion.div>
          <div className="text-sm text-primary/60">Completion Rate</div>
          <motion.div 
            className="flex items-center justify-center mt-1"
            animate={{ y: hoveredMetric === 'completion' ? -2 : 0 }}
          >
            <ChevronUp className="w-4 h-4 text-primary" />
            <span className="text-xs text-primary">+3%</span>
          </motion.div>
        </motion.div>

        <motion.div 
          className="text-center p-4 rounded-lg cursor-pointer transition-all duration-200"
          onMouseEnter={() => setHoveredMetric('orders')}
          onMouseLeave={() => setHoveredMetric(null)}
          whileHover={{ scale: 1.02, backgroundColor: 'hsl(142, 15%, 98%)' }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div 
            className="text-2xl font-semibold text-primary"
            animate={{ 
              scale: hoveredMetric === 'orders' ? 1.1 : 1,
              color: hoveredMetric === 'orders' ? 'hsl(142, 45%, 25%)' : 'hsl(142, 15%, 15%)'
            }}
          >
            {orders.length}
          </motion.div>
          <div className="text-sm text-primary/60">Total Orders</div>
          <motion.div 
            className="flex items-center justify-center mt-1"
            animate={{ y: hoveredMetric === 'orders' ? -2 : 0 }}
          >
            <ChevronUp className="w-4 h-4 text-primary" />
            <span className="text-xs text-primary">+{Math.abs(ordersGrowth).toFixed(0)}%</span>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Orders Over Time */}
        <motion.div
          className="border-b border-primary/10 pb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-primary">Orders Progress</h3>
            <div className="flex items-center gap-1 bg-primary/10 rounded-lg p-1">
              {(['week', 'month', 'year'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setSelectedTimeRange(range)}
                  className={`px-3 py-1 text-sm rounded-md transition-all duration-200 ${
                    selectedTimeRange === range
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-primary/70 hover:text-primary'
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <motion.div 
            className="h-64"
            key={selectedTimeRange}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ordersOverTime}>
                <defs>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(142, 45%, 25%)" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="hsl(142, 45%, 25%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'hsl(142, 10%, 45%)' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'hsl(142, 10%, 45%)' }}
                />
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(142, 15%, 96%)" />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="hsl(142, 45%, 25%)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorOrders)"
                  dot={{ fill: 'hsl(142, 45%, 25%)', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: 'hsl(142, 45%, 25%)', strokeWidth: 2, fill: '#fff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.div>

        {/* Status Distribution */}
        <motion.div
          className="border-b border-primary/10 pb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-primary">Order Status</h3>
            <div className="text-xs text-primary/60">Current distribution</div>
          </div>
          <div className="flex items-center gap-8">
            <div className="h-48 w-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 flex-1">
              {statusDistribution.slice(0, 5).map((item, index) => (
                <motion.div 
                  key={item.name} 
                  className="flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200"
                  whileHover={{ backgroundColor: 'hsl(142, 15%, 98%)', x: 4 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                    whileHover={{ scale: 1.2 }}
                  />
                  <span className="text-sm text-primary/70 flex-1">{item.name}</span>
                  <span className="text-sm font-medium text-primary">{item.value}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Material Usage */}
      <motion.div
        className="border-b border-gray-100 pb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-primary">Material Performance</h3>
          <button className="p-2 hover:bg-primary/10 rounded-lg transition-colors">
            <MoreHorizontal className="w-4 h-4 text-primary/50" />
          </button>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={materialUsage}>
              <XAxis 
                dataKey="material" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#6b7280' }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="count" 
                fill="hsl(142, 15%, 30%)" 
                radius={[4, 4, 0, 0]}
                name="Quantity"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Revenue Trend - Full Width */}
      <motion.div
        className="border-b border-gray-100 pb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-primary">Revenue Trends</h3>
            <p className="text-sm text-primary/60 mt-1">Track your revenue performance over time</p>
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ordersOverTime}>
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#111827"
                strokeWidth={2}
                dot={{ fill: '#111827', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#111827', strokeWidth: 2, fill: '#fff' }}
                name="Revenue ($)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardCharts;
