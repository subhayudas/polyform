
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, LucideIcon } from 'lucide-react';

interface PricingCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  imageUrl: string;
  imageAlt: string;
  pricing: {
    primary?: {
      amount: string;
      unit: string;
      label?: string;
    };
    secondary?: {
      label: string;
      description: string;
    };
    custom?: boolean;
  };
  details: string;
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  description,
  icon: Icon,
  imageUrl,
  imageAlt,
  pricing,
  details
}) => {
  return (
    <Card className="relative overflow-hidden border-polyform-green-200 bg-white/90 backdrop-blur-sm hover:shadow-lg transition-all duration-200 flex flex-col h-full">
      <div className="h-48 overflow-hidden rounded-t-lg">
        <img 
          src={imageUrl} 
          alt={imageAlt} 
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader className="text-center pb-4">
        <div className="w-10 h-10 bg-polyform-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
          <Icon className="w-5 h-5 text-polyform-green-600" />
        </div>
        <CardTitle className="text-lg font-bold text-polyform-green-800">{title}</CardTitle>
        <CardDescription className="text-polyform-green-600 text-sm">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center pt-0 flex flex-col flex-grow">
        <div className="mb-4">
          {pricing.custom ? (
            <span className="text-xl font-bold text-polyform-green-700">Custom Pricing</span>
          ) : (
            <div className="space-y-3">
              {pricing.primary && (
                <div>
                  {pricing.primary.label && (
                    <div className="text-sm font-semibold text-polyform-green-700">{pricing.primary.label}</div>
                  )}
                  <span className="text-3xl font-bold text-polyform-green-700">{pricing.primary.amount}</span>
                  <span className="text-polyform-green-600 text-sm">{pricing.primary.unit}</span>
                </div>
              )}
              {pricing.secondary && (
                <div>
                  <div className="text-sm font-semibold text-polyform-green-700">{pricing.secondary.label}</div>
                  <span className="text-sm text-polyform-green-600">{pricing.secondary.description}</span>
                </div>
              )}
            </div>
          )}
        </div>
        <p className="text-xs text-polyform-green-600 mb-5 leading-relaxed flex-grow">
          {details}
        </p>
        <Link to="/upload" className="mt-auto">
          <Button className="w-full bg-polyform-green-600 hover:bg-polyform-green-700 text-white text-sm">
            Get a Quote
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default PricingCard;
