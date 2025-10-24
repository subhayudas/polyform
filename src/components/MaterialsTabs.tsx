
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MaterialsGrid from './MaterialsGrid';

interface Material {
  name: string;
  properties: string[];
  applications: string[];
  image?: string;
}

interface MaterialCategories {
  plastics: Material[];
  metals: Material[];
  composites: Material[];
  elastomers: Material[];
}

interface MaterialsTabsProps {
  materialCategories: MaterialCategories;
}

const MaterialsTabs = ({ materialCategories }: MaterialsTabsProps) => {
  return (
    <Tabs defaultValue="plastics" className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-8">
        <TabsTrigger value="plastics">Plastics</TabsTrigger>
        <TabsTrigger value="metals">Metals</TabsTrigger>
        <TabsTrigger value="composites">Composites</TabsTrigger>
        <TabsTrigger value="elastomers">Elastomers</TabsTrigger>
      </TabsList>
      
      <TabsContent value="plastics">
        <MaterialsGrid materials={materialCategories.plastics} />
      </TabsContent>
      
      <TabsContent value="metals">
        <MaterialsGrid materials={materialCategories.metals} />
      </TabsContent>
      
      <TabsContent value="composites">
        <MaterialsGrid materials={materialCategories.composites} />
      </TabsContent>
      
      <TabsContent value="elastomers">
        <MaterialsGrid materials={materialCategories.elastomers} />
      </TabsContent>
    </Tabs>
  );
};

export default MaterialsTabs;
