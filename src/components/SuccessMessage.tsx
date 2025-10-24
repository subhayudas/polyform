
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface SuccessMessageProps {
  onStartOver: () => void;
  onViewDashboard: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({
  onStartOver,
  onViewDashboard
}) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-8 text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-600 mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Order Submitted Successfully!</h3>
        <p className="text-gray-600 mb-6">
          We've received your order and will review your file. You'll receive a quote within 24 hours.
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            onClick={onStartOver}
            className="bg-polyform-green-600 hover:bg-polyform-green-700"
          >
            Submit Another Order
          </Button>
          <Button
            variant="outline"
            onClick={onViewDashboard}
          >
            View Dashboard
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SuccessMessage;
