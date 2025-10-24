
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductionServicesGrid from './ProductionServicesGrid';

interface ProductionService {
  title: string;
  description: string;
  features: string[];
}

interface ProductionServices {
  molding: ProductionService[];
  cnc: ProductionService[];
  fabrication: ProductionService[];
}

interface ProductionTabsProps {
  productionServices: ProductionServices;
}

const ProductionTabs: React.FC<ProductionTabsProps> = ({ productionServices }) => {
  return (
    <Tabs defaultValue="molding" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8">
        <TabsTrigger value="molding">Molding</TabsTrigger>
        <TabsTrigger value="cnc">CNC Machining</TabsTrigger>
        <TabsTrigger value="fabrication">Sheet Metal</TabsTrigger>
      </TabsList>
      
      <TabsContent value="molding">
        <ProductionServicesGrid services={productionServices.molding} />
      </TabsContent>
      
      <TabsContent value="cnc">
        <ProductionServicesGrid services={productionServices.cnc} />
      </TabsContent>
      
      <TabsContent value="fabrication">
        <ProductionServicesGrid services={productionServices.fabrication} />
      </TabsContent>
    </Tabs>
  );
};

export default ProductionTabs;
