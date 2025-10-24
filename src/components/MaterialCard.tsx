
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Material {
  name: string;
  properties: string[];
  applications: string[];
  image?: string;
}

interface MaterialCardProps {
  material: Material;
}

const MaterialCard = ({ material }: MaterialCardProps) => {
  return (
    <Card className="hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col h-full">
      {material.image && (
        <div className="h-48 overflow-hidden">
          <img 
            src={material.image} 
            alt={material.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader className="flex-grow">
        <CardTitle className="text-xl font-semibold text-gray-900">
          {material.name}
        </CardTitle>
        <CardDescription className="text-gray-600">
          High-performance material for demanding applications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Properties</h4>
          <div className="space-y-1">
            {material.properties.map((property, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-polyform-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">{property}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Applications</h4>
          <div className="flex flex-wrap gap-1">
            {material.applications.map((app, idx) => (
              <span 
                key={idx}
                className="px-2 py-1 bg-polyform-green-50 text-polyform-green-700 text-xs rounded-full"
              >
                {app}
              </span>
            ))}
          </div>
        </div>
        <Button className="w-full bg-polyform-green-600 hover:bg-polyform-green-700 mt-auto">
          Select Material
        </Button>
      </CardContent>
    </Card>
  );
};

export default MaterialCard;
