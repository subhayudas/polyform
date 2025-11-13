import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ServiceCategory from '@/components/ServiceCategory';
import MaterialsTabs from '@/components/MaterialsTabs';
import WhatsAppButton from '@/components/WhatsAppButton';
import AIChatbot from '@/components/AIChatbot';
import { Printer, Wrench, Zap, Settings, Layers, Sparkles, Package, Factory } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';

const ServicesAndMaterials = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'services' | 'materials'>('services');

  // Update tab based on route
  useEffect(() => {
    if (location.pathname === '/materials') {
      setActiveTab('materials');
    } else if (location.pathname === '/services') {
      setActiveTab('services');
    }
  }, [location.pathname]);

  const handleTabChange = (value: string) => {
    const tab = value as 'services' | 'materials';
    setActiveTab(tab);
    // Navigate to the appropriate route
    navigate(tab === 'services' ? '/services' : '/materials', { replace: true });
  };

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
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Unified Hero Section */}
      <section className="relative pt-20 pb-16 bg-gradient-to-br from-primary/10 via-background to-secondary/10 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Factory className="w-12 h-12 text-primary" />
              <Package className="w-12 h-12 text-secondary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Services & <span className="text-primary">Materials</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Comprehensive manufacturing solutions and premium materials for every project. 
              From rapid prototyping to full-scale production, we provide the services and materials 
              you need to transform your ideas into reality.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content Tabs */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs 
            value={activeTab} 
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-2 mb-12 h-14">
              <TabsTrigger 
                value="services" 
                className="text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Factory className="w-5 h-5 mr-2" />
                Our Services
              </TabsTrigger>
              <TabsTrigger 
                value="materials" 
                className="text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Package className="w-5 h-5 mr-2" />
                Available Materials
              </TabsTrigger>
            </TabsList>
            
            {/* Services Content */}
            <TabsContent value="services" className="mt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-12"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">Manufacturing Services</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Professional manufacturing solutions powered by cutting-edge technology and expert craftsmanship
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {serviceCategories.map((category, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <ServiceCategory
                        title={category.title}
                        description={category.description}
                        icon={category.icon}
                        path={category.path}
                        services={category.services}
                        image={category.image}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </TabsContent>
            
            {/* Materials Content */}
            <TabsContent value="materials" className="mt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-12"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">Premium Materials</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Wide range of high-quality materials for every application. From prototyping to production, 
                    we offer the right material for your specific requirements.
                  </p>
                </div>
                
                <MaterialsTabs materialCategories={materialCategories} />
                
                {/* Additional Benefits Section */}
                <div className="grid md:grid-cols-3 gap-8 mt-16 pt-12 border-t">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Quality Assured</h3>
                    <p className="text-muted-foreground text-sm">
                      Every material batch tested for consistency and performance
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Tech Integration</h3>
                    <p className="text-muted-foreground text-sm">
                      Smart material selection based on your application needs
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Sustainable Choice</h3>
                    <p className="text-muted-foreground text-sm">
                      Eco-friendly options available for environmentally conscious projects
                    </p>
                  </div>
                </div>
              </motion.div>
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

export default ServicesAndMaterials;

