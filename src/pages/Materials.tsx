
import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import MaterialsTabs from '@/components/MaterialsTabs';
import WhatsAppButton from '@/components/WhatsAppButton';
import AIChatbot from '@/components/AIChatbot';

const Materials = () => {
  const materialCategories = {
    plastics: [
      { name: "ABS", properties: ["Impact resistant", "Good heat resistance", "Easy to machine"], applications: ["Automotive", "Electronics", "Toys"], image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=200&fit=crop" },
      { name: "Nylon", properties: ["High strength", "Chemical resistant", "Self-lubricating"], applications: ["Gears", "Bearings", "Industrial parts"], image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=300&h=200&fit=crop" },
      { name: "PLA", properties: ["Biodegradable", "Easy to print", "Good surface finish"], applications: ["Prototypes", "Educational", "Art projects"], image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=300&h=200&fit=crop" },
      { name: "PETG", properties: ["Chemical resistant", "Clear options", "Food safe"], applications: ["Medical", "Food containers", "Display cases"], image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=300&h=200&fit=crop" },
      { name: "TPU", properties: ["Flexible", "Abrasion resistant", "Good elasticity"], applications: ["Gaskets", "Phone cases", "Athletic wear"], image: "https://images.unsplash.com/photo-1493397212122-2b85dda8106b?w=300&h=200&fit=crop" },
      { name: "Polycarbonate", properties: ["High impact", "Temperature resistant", "Optical clarity"], applications: ["Safety equipment", "Automotive", "Medical devices"], image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=300&h=200&fit=crop" }
    ],
    metals: [
      { name: "Aluminum", properties: ["Lightweight", "Corrosion resistant", "Good conductivity"], applications: ["Aerospace", "Automotive", "Electronics"], image: "https://images.unsplash.com/photo-1487887235947-a955ef187fcc?w=300&h=200&fit=crop" },
      { name: "Steel", properties: ["High strength", "Cost effective", "Magnetic"], applications: ["Construction", "Automotive", "Tools"], image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=200&fit=crop" },
      { name: "Titanium", properties: ["Biocompatible", "Corrosion resistant", "High strength-to-weight"], applications: ["Medical", "Aerospace", "Marine"], image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300&h=200&fit=crop" },
      { name: "Copper", properties: ["Excellent conductivity", "Antimicrobial", "Malleable"], applications: ["Electronics", "Plumbing", "Heat exchangers"], image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=200&fit=crop" }
    ],
    composites: [
      { name: "Carbon Fiber Reinforced", properties: ["Ultra-lightweight", "High stiffness", "Excellent strength"], applications: ["Aerospace", "Racing", "High-performance parts"], image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=300&h=200&fit=crop" },
      { name: "Glass-Filled Nylon", properties: ["Enhanced stiffness", "Reduced shrinkage", "Better heat resistance"], applications: ["Automotive", "Industrial", "Electrical components"], image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=300&h=200&fit=crop" }
    ],
    elastomers: [
      { name: "Silicone", properties: ["Temperature stable", "Chemical inert", "Biocompatible"], applications: ["Medical", "Food grade", "Seals"], image: "https://images.unsplash.com/photo-1493397212122-2b85dda8106b?w=300&h=200&fit=crop" },
      { name: "TPE", properties: ["Recyclable", "Chemical resistant", "Flexible"], applications: ["Consumer goods", "Automotive", "Medical devices"], image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=300&h=200&fit=crop" }
    ]
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section with Image */}
      <section className="relative pt-20 pb-12 bg-gradient-to-br from-polyform-green-50 to-white overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2000&q=80" 
            alt="Advanced materials and circuits"
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Materials
              <span className="text-polyform-green-600 block">Available</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Wide range of materials for every application. From prototyping to production, 
              we offer the right material for your specific requirements.
            </p>
          </div>
        </div>
      </section>

      {/* Materials Grid with Visual Elements */}
      <section className="py-16 relative">
        {/* Decorative Elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-polyform-green-100 rounded-full opacity-20"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-polyform-green-200 rounded-full opacity-30"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MaterialsTabs materialCategories={materialCategories} />
        </div>
      </section>

      {/* Additional Visual Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-polyform-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=100&q=80" 
                  alt="Advanced manufacturing"
                  className="w-10 h-10 rounded-full object-cover"
                />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Quality Assured</h3>
              <p className="text-gray-600 text-sm">Every material batch tested for consistency and performance</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-polyform-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=100&q=80" 
                  alt="Technology integration"
                  className="w-10 h-10 rounded-full object-cover"
                />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Tech Integration</h3>
              <p className="text-gray-600 text-sm">Smart material selection based on your application needs</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-polyform-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-3 h-3 bg-polyform-green-500 rounded-full"></div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Sustainable Choice</h3>
              <p className="text-gray-600 text-sm">Eco-friendly options available for environmentally conscious projects</p>
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

export default Materials;
