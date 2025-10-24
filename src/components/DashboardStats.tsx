
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Package, Clock, CheckCircle, DollarSign } from 'lucide-react';

interface DashboardStatsProps {
  summary: {
    totalOrders: number;
    activeOrders: number;
    completedOrders: number;
    totalSpent: number;
  };
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
              <p className="text-sm font-medium text-gray-600">Active Orders</p>
              <p className="text-3xl font-bold text-blue-600">{summary.activeOrders}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-600" />
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
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-3xl font-bold text-gray-900">${summary.totalSpent.toFixed(2)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-polyform-green-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
