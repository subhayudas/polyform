
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Factory, 
  Package, 
  Award
} from 'lucide-react';

const PartnerTypesSection = () => {
  const partnerTypes = [
    {
      title: "3D Printing Services",
      description: "Additive manufacturing specialists with advanced equipment",
      icon: <Package className="w-8 h-8" />,
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      title: "CNC Machining",
      description: "Precision manufacturing with state-of-the-art CNC equipment",
      icon: <Factory className="w-8 h-8" />,
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      title: "Material Suppliers",
      description: "Reliable suppliers of industrial-grade materials",
      icon: <Package className="w-8 h-8" />,
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      title: "Finishing Services",
      description: "Post-processing and finishing specialists",
      icon: <Award className="w-8 h-8" />,
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Partner Categories
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're looking for partners across various manufacturing and supply categories
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {partnerTypes.map((type, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 overflow-hidden group">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={type.image} 
                  alt={type.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-polyform-green-600 bg-opacity-20"></div>
              </div>
              <CardHeader className="flex flex-row items-center space-y-0 pb-4">
                <div className="w-12 h-12 bg-polyform-green-100 rounded-lg flex items-center justify-center mr-4 text-polyform-green-600">
                  {type.icon}
                </div>
                <div>
                  <CardTitle className="text-xl">{type.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{type.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnerTypesSection;
