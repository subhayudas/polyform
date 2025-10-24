
import React from 'react';
import { Card } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const RequirementsSection = () => {
  const requirements = [
    "ISO certification or equivalent quality standards",
    "Proven track record in manufacturing/supply",
    "Capacity for scalable production",
    "Commitment to delivery timelines",
    "Competitive pricing structure"
  ];

  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Partner Requirements
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              To maintain our quality standards, we look for partners who meet these criteria
            </p>
            
            <Card className="p-8">
              <div className="space-y-4">
                {requirements.map((requirement, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-polyform-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{requirement}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
              alt="Quality standards" 
              className="rounded-lg shadow-xl"
            />
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-polyform-green-100 rounded-full opacity-50"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RequirementsSection;
