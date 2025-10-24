
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Package, DollarSign, Clock } from 'lucide-react';

interface AdminStatsProps {
  summary: {
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    totalRevenue: number;
  };
}

const AdminStats = ({ summary }: AdminStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900">{summary.totalOrders}</p>
            </div>
            <Package className="w-8 h-8 text-polyform-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Orders</p>
              <p className="text-3xl font-bold text-orange-600">{summary.pendingOrders}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-green-600">{summary.completedOrders}</p>
            </div>
            <Package className="w-8 h-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">${summary.totalRevenue.toFixed(2)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-polyform-green-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStats;
