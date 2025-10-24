
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp, 
  Handshake, 
  Globe, 
  Award
} from 'lucide-react';

const BenefitsSection = () => {
  const benefits = [
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Expand Your Reach",
      description: "Access new markets and customers through our platform"
    },
    {
      icon: <Handshake className="w-6 h-6" />,
      title: "Strategic Partnerships",
      description: "Collaborate on projects and share resources for mutual growth"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Network",
      description: "Connect with manufacturers and vendors worldwide"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Quality Assurance",
      description: "Join a network focused on high-quality standards"
    }
  ];

  return (
    <section className="py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Partner With Us?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join a growing network of manufacturers and suppliers committed to excellence
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105 border-polyform-green-100">
              <CardHeader>
                <div className="w-12 h-12 bg-polyform-green-100 rounded-lg flex items-center justify-center mx-auto mb-4 text-polyform-green-600">
                  {benefit.icon}
                </div>
                <CardTitle className="text-lg">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{benefit.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
