import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Clock, 
  CheckCircle, 
  Package, 
  AlertCircle, 
  Truck, 
  XCircle,
  Circle,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useOrders } from '@/hooks/useOrders';
import { supabase } from '@/integrations/supabase/client';

interface OrderTimelineProps {
  orderId: string;
}

interface StatusHistoryItem {
  id: string;
  old_status: string | null;
  new_status: string;
  change_reason: string | null;
  changed_by: string | null;
  created_at: string;
}

const statusConfig = {
  pending: {
    label: 'Pending',
    icon: Clock,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/30',
  },
  confirmed: {
    label: 'Confirmed',
    icon: CheckCircle,
    color: 'text-primary',
    bgColor: 'bg-primary/15',
    borderColor: 'border-primary/40',
  },
  in_production: {
    label: 'In Production',
    icon: Package,
    color: 'text-primary',
    bgColor: 'bg-primary/20',
    borderColor: 'border-primary/50',
  },
  quality_check: {
    label: 'Quality Check',
    icon: AlertCircle,
    color: 'text-primary',
    bgColor: 'bg-primary/25',
    borderColor: 'border-primary/60',
  },
  shipped: {
    label: 'Shipped',
    icon: Truck,
    color: 'text-primary',
    bgColor: 'bg-primary/30',
    borderColor: 'border-primary/70',
  },
  delivered: {
    label: 'Delivered',
    icon: CheckCircle2,
    color: 'text-primary',
    bgColor: 'bg-primary/35',
    borderColor: 'border-primary/80',
  },
  cancelled: {
    label: 'Cancelled',
    icon: XCircle,
    color: 'text-primary/70',
    bgColor: 'bg-primary/5',
    borderColor: 'border-primary/20',
  },
  on_hold: {
    label: 'On Hold',
    icon: AlertCircle,
    color: 'text-primary/60',
    bgColor: 'bg-primary/8',
    borderColor: 'border-primary/25',
  },
};

const OrderTimeline: React.FC<OrderTimelineProps> = ({ orderId }) => {
  const [history, setHistory] = useState<StatusHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data, error } = await supabase
          .from('order_status_history')
          .select('*')
          .eq('order_id', orderId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setHistory(data || []);
      } catch (error) {
        console.error('Error fetching status history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) {
      fetchHistory();
    }
  }, [orderId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-polyform-green-600"></div>
            <span className="ml-2 text-sm text-primary/70">Loading timeline...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Order Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-primary/60 text-center py-4">
            No status history available
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Order Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-primary/20" />
            
            <div className="space-y-6 pl-2">
              {history.map((item, index) => {
                const config = statusConfig[item.new_status as keyof typeof statusConfig] || statusConfig.pending;
                const Icon = config.icon;
                const isLatest = index === 0;

                return (
                  <div key={item.id} className="relative flex items-start gap-4">
                    {/* Timeline dot */}
                    <div className={cn(
                      "relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2",
                      isLatest ? config.bgColor : 'bg-white',
                      isLatest ? config.borderColor : 'border-primary/20',
                      isLatest && config.color
                    )}>
                      {isLatest ? (
                        <Icon className="w-4 h-4" />
                      ) : (
                        <Circle className="w-2 h-2 fill-current" />
                      )}
                    </div>

                    {/* Content */}
                    <div className={cn(
                      "flex-1 pb-6 rounded-lg p-4 transition-all",
                      isLatest && config.bgColor,
                      !isLatest && "bg-primary/5"
                    )}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={cn("font-semibold text-sm", config.color)}>
                            {config.label}
                          </span>
                          {isLatest && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-white text-primary font-medium">
                              Current
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-primary/60">
                          {formatDate(item.created_at)}
                        </span>
                      </div>
                      
                      {item.old_status && (
                        <p className="text-xs text-primary/70 mb-2">
                          Changed from: <span className="font-medium">{item.old_status.replace('_', ' ')}</span>
                        </p>
                      )}
                      
                      {item.change_reason && (
                        <p className="text-sm text-primary/80 mt-2">
                          {item.change_reason}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default OrderTimeline;

