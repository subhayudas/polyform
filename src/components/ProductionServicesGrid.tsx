
import React from 'react';
import ProductionServiceCard from './ProductionServiceCard';

interface ProductionService {
  title: string;
  description: string;
  features: string[];
}

interface ProductionServicesGridProps {
  services: ProductionService[];
}

const ProductionServicesGrid: React.FC<ProductionServicesGridProps> = ({ services }) => {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {services.map((service, index) => (
        <ProductionServiceCard key={index} service={service} />
      ))}
    </div>
  );
};

export default ProductionServicesGrid;
