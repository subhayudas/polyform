
import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import AIChatbot from '@/components/AIChatbot';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const LaserEngraving = () => {
  const services = [
    {
      title: "Laser Engraving",
      description: "Deep, permanent marking with excellent durability and readability",
      applications: ["Product branding", "Serial numbers", "Custom designs", "Personalization"],
      materials: ["Metal", "Wood", "Plastic", "Glass", "Leather"],
      image: "https://images.unsplash.com/photo-1487887235947-a955ef187fcc?w=500&h=300&fit=crop"
    },
    {
      title: "Laser Etching", 
      description: "Surface-level marking for fine details and high-resolution images",
      applications: ["Logos", "Text", "QR codes", "Fine artwork", "Data matrix codes"],
      materials: ["Stainless Steel", "Aluminum", "Titanium", "Plastics", "Ceramics"],
      image: "https://images.unsplash.com/photo-1493397212122-2b85dda8106b?w=500&h=300&fit=crop"
    },
    {
      title: "Laser Marking",
      description: "Contrast marking without material removal for clean identification",
      applications: ["Part identification", "Traceability", "Compliance marking", "Medical devices"],
      materials: ["Medical grade materials", "Food safe plastics", "Metals", "Composites"],
      image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=500&h=300&fit=crop"
    }
  ];

  const capabilities = [
    "High-resolution marking up to 1200 DPI",
    "Permanent, tamper-resistant marks", 
    "No consumables or chemical processes",
    "Environmentally friendly process",
    "Fast turnaround times",
    "Custom fixtures for complex parts"
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <section className="pt-20 pb-12 bg-gradient-to-br from-polyform-green-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Laser Engraving
              <span className="text-polyform-green-600 block">& Etching</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Precision marking and customization services for permanent identification, 
              branding, and decorative applications across various materials.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-1 gap-8 mb-16">
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
                  <div className="p-6">
                    <CardHeader className="p-0 mb-4">
                      <CardTitle className="text-2xl font-semibold text-gray-900">
                        {service.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 text-lg">
                        {service.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="grid gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Applications</h4>
                          <div className="space-y-2">
                            {service.applications.map((app, idx) => (
                              <div key={idx} className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-polyform-green-500 rounded-full"></div>
                                <span className="text-gray-700">{app}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Compatible Materials</h4>
                          <div className="flex flex-wrap gap-2">
                            {service.materials.map((material, idx) => (
                              <span 
                                key={idx}
                                className="px-3 py-1 bg-polyform-green-50 text-polyform-green-700 text-sm rounded-full"
                              >
                                {material}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Button className="w-full mt-6 bg-polyform-green-600 hover:bg-polyform-green-700">
                        Request {service.title}
                      </Button>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Capabilities Section */}
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Our Capabilities</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {capabilities.map((capability, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-polyform-green-500 rounded-full"></div>
                  <span className="text-gray-700">{capability}</span>
                </div>
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

export default LaserEngraving;
