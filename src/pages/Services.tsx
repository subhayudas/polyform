import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ServiceCategory from '@/components/ServiceCategory';
import WhatsAppButton from '@/components/WhatsAppButton';
import AIChatbot from '@/components/AIChatbot';
import { Printer, Wrench, Zap, Settings, Layers, Sparkles } from 'lucide-react';

const Services = () => {
  const serviceCategories = [
    {
      title: "3D Printing Services",
      description: "Professional additive manufacturing for prototypes and production parts",
      icon: Printer,
      path: "/3d-printing",
      services: ["FDM Printing", "SLA Printing", "Multi-Material", "Post-Processing"],
      image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=450&fit=crop"
    },
    {
      title: "CNC Machining",
      description: "Precision subtractive manufacturing for metal and plastic components",
      icon: Settings,
      path: "/cnc-machining",
      services: ["3-Axis Milling", "4-Axis Milling", "Turning", "Surface Finishing"],
      image: "https://images.unsplash.com/photo-1565008576549-57569a49371d?w=800&h=450&fit=crop"
    },
    {
      title: "Sheet Metal Fabrication",
      description: "Custom metalworking solutions from prototypes to production runs",
      icon: Layers,
      path: "/sheet-metal-fabrication",
      services: ["Laser Cutting", "Bending", "Welding", "Assembly"],
      image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&h=450&fit=crop"
    },
    {
      title: "CAD Modeling",
      description: "Professional design services from concept to production-ready models",
      icon: Wrench,
      path: "/cad-modeling",
      services: ["3D Modeling", "Technical Drawings", "Design Optimization", "Reverse Engineering"],
      image: "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=800&h=450&fit=crop"
    },
    {
      title: "Laser Engraving",
      description: "Precision marking and customization for various materials",
      icon: Sparkles,
      path: "/laser-engraving",
      services: ["Engraving", "Etching", "Marking", "Personalization"],
      image: "https://images.unsplash.com/photo-1562408590-e32931084e23?w=800&h=450&fit=crop"
    },
    {
      title: "Manufacturing Solutions",
      description: "End-to-end production services and supply chain management",
      icon: Zap,
      path: "/manufacturing-solutions",
      services: ["Assembly", "Quality Control", "Packaging", "Logistics"],
      image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&h=450&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Our <span className="text-primary">Services</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Comprehensive manufacturing solutions from rapid prototyping to full-scale production. 
                Transform your ideas into reality with our cutting-edge technology and expertise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceCategories.map((category, index) => (
              <ServiceCategory
                key={index}
                title={category.title}
                description={category.description}
                icon={category.icon}
                path={category.path}
                services={category.services}
                image={category.image}
              />
            ))}
          </div>
        </div>
      </section>

      <WhatsAppButton variant="fixed" />
      <AIChatbot />
      <Footer />
    </div>
  );
};

export default Services;
