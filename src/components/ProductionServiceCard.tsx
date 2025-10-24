
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ProductionService {
  title: string;
  description: string;
  features: string[];
}

interface ProductionServiceCardProps {
  service: ProductionService;
}

const ProductionServiceCard: React.FC<ProductionServiceCardProps> = ({ service }) => {
  return (
    <Card className="hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">
          {service.title}
        </CardTitle>
        <CardDescription className="text-gray-600">
          {service.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {service.features.map((feature, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-polyform-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
          <Button className="w-full bg-polyform-green-600 hover:bg-polyform-green-700">
            Get Quote
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductionServiceCard;
