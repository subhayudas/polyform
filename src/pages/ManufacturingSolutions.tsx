import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import AIChatbot from '@/components/AIChatbot';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

const ManufacturingSolutions = () => {
  const solutionCategories = {
    production: [
      {
        title: "Assembly Services",
        description: "Complete product assembly from components to finished goods",
        features: ["Sub-assembly", "Final assembly", "Testing", "Packaging"]
      },
      {
        title: "Rapid Prototyping",
        description: "Fast iteration from concept to functional prototype",
        features: ["Quick turnaround", "Multiple technologies", "Design validation", "Functional testing"]
      },
      {
        title: "High-Volume Production",
        description: "Scalable manufacturing for large quantity orders",
        features: ["Automated processes", "Quality systems", "Supply chain management", "Cost optimization"]
      },
      {
        title: "Low-Volume / Small Batch",
        description: "Flexible manufacturing for specialized or emerging products",
        features: ["Flexible setup", "Custom tooling", "Quality focus", "Quick changeovers"]
      },
      {
        title: "On-Demand Manufacturing",
        description: "Just-in-time production to reduce inventory and lead times",
        features: ["No minimum orders", "Fast response", "Inventory reduction", "Lean manufacturing"]
      }
    ],
    finishing: [
      {
        title: "Sandblasting",
        description: "Surface preparation and texture creation",
        features: ["Various media types", "Uniform finish", "Deburring", "Surface preparation"]
      },
      {
        title: "Polishing",
        description: "Mirror-like surface finish for aesthetic and functional requirements",
        features: ["High gloss finish", "Scratch removal", "Various grades", "Automated processes"]
      },
      {
        title: "Painting & Coating",
        description: "Protective and decorative surface treatments",
        features: ["Powder coating", "Wet paint", "Primer application", "Custom colors"]
      },
      {
        title: "Anodizing",
        description: "Electrochemical surface treatment for aluminum parts",
        features: ["Corrosion resistance", "Wear resistance", "Color options", "Electrical insulation"]
      },
      {
        title: "Heat Treatment",
        description: "Thermal processing to enhance material properties",
        features: ["Stress relief", "Hardening", "Tempering", "Normalizing"]
      }
    ]
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <section className="pt-20 pb-12 bg-gradient-to-br from-polyform-green-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Manufacturing
              <span className="text-polyform-green-600 block">Solutions</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              End-to-end support from prototype to scale-up production. 
              Comprehensive manufacturing solutions tailored to your needs.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="production" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="production">Production Solutions</TabsTrigger>
              <TabsTrigger value="finishing">Post-Processing & Finishing</TabsTrigger>
            </TabsList>
            
            <TabsContent value="production">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {solutionCategories.production.map((solution, index) => (
                  <Card key={index} className="hover:shadow-xl transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {solution.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        {solution.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          {solution.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-polyform-green-500 rounded-full"></div>
                              <span className="text-sm text-gray-700">{feature}</span>
                            </div>
                          ))}
                        </div>
                        <Button className="w-full bg-polyform-green-600 hover:bg-polyform-green-700">
                          Learn More
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="finishing">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {solutionCategories.finishing.map((solution, index) => (
                  <Card key={index} className="hover:shadow-xl transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {solution.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        {solution.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          {solution.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-polyform-green-500 rounded-full"></div>
                              <span className="text-sm text-gray-700">{feature}</span>
                            </div>
                          ))}
                        </div>
                        <Button className="w-full bg-polyform-green-600 hover:bg-polyform-green-700">
                          Get Quote
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <WhatsAppButton variant="fixed" />
      <AIChatbot />
      <Footer />
    </div>
  );
};

export default ManufacturingSolutions;
