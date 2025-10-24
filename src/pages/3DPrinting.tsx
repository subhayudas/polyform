
import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ThreeDPrinting = () => {
  const printingServices = [
    {
      title: "FDM (Fused Deposition Modeling)",
      description: "Cost-effective prototyping and functional parts with excellent material variety",
      features: ["Quick turnaround", "Wide material selection", "Large build volumes", "Functional prototypes"],
      materials: ["PLA", "ABS", "PETG", "TPU", "Nylon"],
      image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop",
      applications: ["Prototypes", "Functional parts", "Large components", "Multi-material prints"]
    },
    {
      title: "SLA (Stereolithography)", 
      description: "High-precision parts with smooth surface finish for detailed prototypes",
      features: ["Exceptional detail", "Smooth surfaces", "Fine features", "Clear resins available"],
      materials: ["Standard Resin", "Tough Resin", "Flexible Resin", "Clear Resin"],
      image: "https://images.unsplash.com/photo-1565439974294-c64b0e41b0b9?w=800&h=600&fit=crop",
      applications: ["Jewelry", "Dental models", "Miniatures", "High-detail prototypes"]
    },
    {
      title: "SLS (Selective Laser Sintering)",
      description: "Strong, functional parts without support structures for complex geometries",
      features: ["No supports needed", "Complex geometries", "Production-grade strength", "Minimal post-processing"],
      materials: ["Nylon PA12", "Glass-filled Nylon", "Aluminum-filled Nylon"],
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
      applications: ["End-use parts", "Complex assemblies", "Aerospace components", "Automotive parts"]
    },
    {
      title: "MJF (Multi Jet Fusion)",
      description: "High-volume production with excellent mechanical properties and surface quality",
      features: ["High throughput", "Excellent surface finish", "Consistent properties", "Ideal for production"],
      materials: ["PA12 Nylon", "PA11 Nylon", "Glass Bead Blasted finishes"],
      image: "https://images.unsplash.com/photo-1588421357574-87938a86fa28?w=800&h=600&fit=crop",
      applications: ["Production runs", "Functional parts", "Consumer products", "Industrial components"]
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section with Video */}
      <section className="relative pt-20 pb-12 bg-gradient-to-br from-polyform-green-50 to-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <video
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src="https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4" type="video/mp4" />
          </video>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              3D Printing
              <span className="text-polyform-green-600 block">Services</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Advanced additive manufacturing technologies for rapid prototyping and production. 
              From concept to final product with precision and sustainability.
            </p>
            
            {/* WhatsApp CTA */}
            <div className="flex justify-center">
              <WhatsAppButton 
                size="lg"
                message="Hi! I'm interested in your 3D printing services. Can you help me with my project?"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid with Images */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {printingServices.map((service, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className={`grid lg:grid-cols-2 gap-0 ${index % 2 === 1 ? 'lg:grid-cols-2' : ''}`}>
                  {/* Image Section */}
                  <div className={`relative h-64 lg:h-auto ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <img
                      src={service.image}
                      alt={service.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
                  </div>
                  
                  {/* Content Section */}
                  <div className={`p-8 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <CardHeader className="p-0 mb-6">
                      <CardTitle className="text-2xl font-semibold text-gray-900">
                        {service.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 text-lg">
                        {service.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="p-0 space-y-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Key Features</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {service.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-polyform-green-500 rounded-full"></div>
                              <span className="text-sm text-gray-700">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Available Materials</h4>
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

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Common Applications</h4>
                        <div className="flex flex-wrap gap-2">
                          {service.applications.map((app, idx) => (
                            <span 
                              key={idx}
                              className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                            >
                              {app}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button className="flex-1 bg-polyform-green-600 hover:bg-polyform-green-700">
                          Get Quote for {service.title.split(' ')[0]}
                        </Button>
                        <WhatsAppButton 
                          message={`Hi! I need a quote for ${service.title} service. Can you help me?`}
                        />
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Video Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our 3D Printing Process</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From file upload to finished product, see how we bring your designs to life
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-polyform-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                <div>
                  <h3 className="font-semibold text-gray-900">File Upload & Analysis</h3>
                  <p className="text-gray-600">Upload your 3D files and receive instant analysis and pricing</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-polyform-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Material Selection</h3>
                  <p className="text-gray-600">Choose from our wide range of materials based on your requirements</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-polyform-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Quality Printing</h3>
                  <p className="text-gray-600">Your parts are printed using state-of-the-art equipment with strict quality control</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-polyform-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">4</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Finishing & Delivery</h3>
                  <p className="text-gray-600">Post-processing, quality inspection, and fast delivery to your door</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <video
                className="w-full h-auto rounded-lg shadow-lg"
                controls
                poster="https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop"
              >
                <source src="https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* Fixed WhatsApp Button */}
      <WhatsAppButton variant="fixed" />

      <Footer />
    </div>
  );
};

export default ThreeDPrinting;
