import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ProductionTabs from '@/components/ProductionTabs';
import WhatsAppButton from '@/components/WhatsAppButton';
import AIChatbot from '@/components/AIChatbot';

const Production = () => {
  const productionServices = {
    molding: [
      {
        title: "Plastic Injection Molding",
        description: "High-volume production of precise plastic parts",
        features: ["High repeatability", "Complex geometries", "Multiple materials", "Cost-effective for volume"]
      },
      {
        title: "Vacuum Casting (Urethane Casting)",
        description: "Low-volume production with injection molding quality",
        features: ["Quick turnaround", "Prototype to production", "Various shore hardness", "Complex undercuts"]
      }
    ],
    cnc: [
      {
        title: "3-Axis CNC Machining",
        description: "Versatile machining for standard geometries",
        features: ["High precision", "Wide material range", "Cost-effective", "Fast setup"]
      },
      {
        title: "4-Axis & 5-Axis CNC",
        description: "Complex geometries with superior surface finish",
        features: ["Complex angles", "Reduced setups", "Superior finish", "Tight tolerances"]
      },
      {
        title: "CNC Milling",
        description: "Precision removal of material for complex parts",
        features: ["High accuracy", "Complex features", "Various materials", "Custom tooling"]
      },
      {
        title: "CNC Turning",
        description: "Cylindrical parts with excellent concentricity",
        features: ["Round parts", "Threading", "Tight tolerances", "High surface quality"]
      }
    ],
    fabrication: [
      {
        title: "Laser Cutting",
        description: "Precise cutting with clean edges",
        features: ["High precision", "Minimal kerf", "Complex patterns", "Various thicknesses"]
      },
      {
        title: "Waterjet Cutting",
        description: "Cut virtually any material without heat affected zones",
        features: ["No heat distortion", "Thick materials", "Precise cuts", "Minimal waste"]
      },
      {
        title: "Plasma Cutting",
        description: "Fast cutting for thick metal plates",
        features: ["High speed", "Thick materials", "Cost-effective", "Large format"]
      },
      {
        title: "Metal Bending & Stamping",
        description: "Form metal sheets into complex shapes",
        features: ["Complex bends", "High repeatability", "Various metals", "Progressive dies"]
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
              Production &
              <span className="text-polyform-green-600 block">Fabrication</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Durable parts, tooling, and production-ready components. 
              From prototypes to high-volume manufacturing with precision and reliability.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductionTabs productionServices={productionServices} />
        </div>
      </section>

      <WhatsAppButton variant="fixed" />
      <AIChatbot />
      <Footer />
    </div>
  );
};

export default Production;
