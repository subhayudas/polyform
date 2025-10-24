
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Calculator, Clock, Package, Truck } from 'lucide-react';
import { estimateFileProperties, calculatePrintingCost, formatEstimatedDelivery } from '@/utils/pricingCalculator';

interface InstantPricingProps {
  file: File;
  selectedMaterial: string;
  quantity: number;
  onPricingUpdate: (pricing: any) => void;
}

const InstantPricing: React.FC<InstantPricingProps> = ({
  file,
  selectedMaterial,
  quantity,
  onPricingUpdate
}) => {
  const [pricing, setPricing] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    if (file && selectedMaterial) {
      calculateInstantPricing();
    }
  }, [file, selectedMaterial, quantity]);

  const calculateInstantPricing = async () => {
    setIsCalculating(true);
    
    try {
      // Add a small delay to simulate processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const fileProperties = estimateFileProperties(file);
      const pricingData = calculatePrintingCost(fileProperties, selectedMaterial, quantity);
      const estimatedDelivery = formatEstimatedDelivery(pricingData.estimatedTime);
      
      const fullPricing = {
        ...pricingData,
        estimatedDelivery,
        fileProperties
      };
      
      setPricing(fullPricing);
      onPricingUpdate(fullPricing);
    } catch (error) {
      console.error('Error calculating pricing:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  if (isCalculating) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <Calculator className="w-5 h-5 animate-spin text-polyform-green-600" />
            <span className="text-sm text-gray-600">Calculating instant pricing...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!pricing) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calculator className="w-5 h-5 text-polyform-green-600" />
          <span>Instant Quote</span>
        </CardTitle>
        <CardDescription>
          Pricing estimate for {file.name} × {quantity}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price Breakdown */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Material Cost</span>
            <span className="font-medium">${pricing.materialCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Labor Cost</span>
            <span className="font-medium">${pricing.laborCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Setup Cost</span>
            <span className="font-medium">${pricing.setupCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Complexity Cost</span>
            <span className="font-medium">${pricing.complexityCost.toFixed(2)}</span>
          </div>
          
          <Separator />
          
          <div className="flex justify-between items-center text-lg font-semibold">
            <span>Total</span>
            <span className="text-polyform-green-600">${pricing.total.toFixed(2)}</span>
          </div>
          
          {quantity > 1 && (
            <div className="text-sm text-gray-500 text-center">
              ${(pricing.total / quantity).toFixed(2)} per item
              {quantity >= 5 && (
                <Badge variant="secondary" className="ml-2">
                  {quantity >= 10 ? '15%' : '10%'} bulk discount applied
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Estimated Details */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="w-4 h-4 text-gray-500 mr-1" />
              <span className="text-sm font-medium">Print Time</span>
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {pricing.estimatedTime.toFixed(1)}h
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Package className="w-4 h-4 text-gray-500 mr-1" />
              <span className="text-sm font-medium">Weight</span>
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {pricing.weight.toFixed(0)}g
            </div>
          </div>
        </div>

        {/* Estimated Delivery */}
        <div className="bg-polyform-green-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Truck className="w-4 h-4 text-polyform-green-600" />
            <span className="text-sm font-medium text-polyform-green-800">Estimated Delivery</span>
          </div>
          <div className="text-lg font-semibold text-polyform-green-900">
            {pricing.estimatedDelivery.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>

        {/* File Analysis */}
        <div className="text-xs text-gray-500 space-y-1">
          <div className="font-medium">Analysis Summary:</div>
          <div>Complexity: {pricing.fileProperties.complexity}/5</div>
          <div>Support Required: {pricing.fileProperties.supportRequired ? 'Yes' : 'No'}</div>
          <div>Estimated Volume: {(pricing.fileProperties.volume / 1000).toFixed(1)} cm³</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InstantPricing;
