
import React from 'react';
import MaterialCard from './MaterialCard';

interface Material {
  name: string;
  properties: string[];
  applications: string[];
  image?: string;
}

interface MaterialsGridProps {
  materials: Material[];
}

const MaterialsGrid = ({ materials }: MaterialsGridProps) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {materials.map((material, index) => (
        <MaterialCard key={index} material={material} />
      ))}
    </div>
  );
};

export default MaterialsGrid;
