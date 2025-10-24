
import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import AIChatbot from '@/components/AIChatbot';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const CADModeling = () => {
  const services = [
    {
      title: "Parametric Design",
      description: "Intelligent 3D models that adapt to design changes with full parametric control",
      capabilities: [
        "Feature-based modeling",
        "Design automation", 
        "Version control",
        "Design optimization"
      ],
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=500&h=300&fit=crop"
    },
    {
      title: "Reverse Engineering",
      description: "Transform physical parts into accurate digital models for redesign or reproduction",
      capabilities: [
        "3D scanning integration",
        "Surface reconstruction",
        "Legacy part documentation",
        "Tolerance analysis"
      ],
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=500&h=300&fit=crop"
    },
    {
      title: "Design for Manufacturability (DFM)",
      description: "Optimize designs for production efficiency while maintaining functionality",
      capabilities: [
        "Manufacturing process optimization",
        "Cost reduction analysis",
        "Material efficiency",
        "Quality enhancement"
      ],
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500&h=300&fit=crop"
    }
  ];

  const softwareExpertise = [
    "SolidWorks", "Fusion 360", "Inventor", "CATIA", "Rhino", "KeyShot"
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <section className="pt-20 pb-12 bg-gradient-to-br from-polyform-green-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              3D Modeling &
              <span className="text-polyform-green-600 block">CAD Services</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional design services from concept to production-ready models. 
              Transform your ideas into precise, manufacturable designs.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="h-64 md:h-auto">
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 flex flex-col">
                    <CardHeader className="p-0 mb-4">
                      <CardTitle className="text-2xl font-semibold text-gray-900">
                        {service.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 text-lg">
                        {service.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 flex-grow">
                      <div className="grid gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Capabilities</h4>
                          <div className="space-y-2">
                            {service.capabilities.map((capability, idx) => (
                              <div key={idx} className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-polyform-green-500 rounded-full"></div>
                                <span className="text-gray-700">{capability}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="mt-auto">
                          <Button className="w-full bg-polyform-green-600 hover:bg-polyform-green-700">
                            Request {service.title}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Software Expertise */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Software Expertise</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {softwareExpertise.map((software, index) => (
                <span 
                  key={index}
                  className="px-6 py-3 bg-white border border-polyform-green-200 text-polyform-green-700 rounded-lg font-medium hover:bg-polyform-green-50 transition-colors"
                >
                  {software}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <WhatsAppButton variant="fixed" />
      <AIChatbot />
      <Footer />
    </div>
  );
};

export default CADModeling;
