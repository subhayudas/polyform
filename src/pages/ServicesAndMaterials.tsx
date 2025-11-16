import React, { useState, useEffect, useMemo } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ServiceCategory from '@/components/ServiceCategory';
import MaterialsTabs from '@/components/MaterialsTabs';
import WhatsAppButton from '@/components/WhatsAppButton';
import AIChatbot from '@/components/AIChatbot';
import { Printer, Wrench, Zap, Settings, Layers, Sparkles, Package, Factory, Search, Filter, TrendingUp, Clock, Award, CheckCircle2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

const ServicesAndMaterials = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'services' | 'materials'>('services');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'name' | 'popularity'>('default');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Update tab based on route
  useEffect(() => {
    if (location.pathname === '/materials') {
      setActiveTab('materials');
      // Scroll to materials section after a short delay to ensure it's rendered
      setTimeout(() => {
        const materialsSection = document.getElementById('materials-section');
        if (materialsSection) {
          // Account for fixed navigation bar (approximately 64px height)
          const offset = 80;
          const elementPosition = materialsSection.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    } else if (location.pathname === '/services') {
      setActiveTab('services');
    }
  }, [location.pathname]);

  const handleTabChange = (value: string) => {
    const tab = value as 'services' | 'materials';
    setActiveTab(tab);
    // Navigate to the appropriate route
    navigate(tab === 'services' ? '/services' : '/materials', { replace: true });
    // Reset filters when switching tabs
    setSearchQuery('');
    setFilterCategory('all');
  };

  // Statistics data
  const stats = [
    { label: 'Active Services', value: '6+', icon: Factory, color: 'text-primary' },
    { label: 'Materials Available', value: '14+', icon: Package, color: 'text-secondary' },
    { label: 'Avg. Turnaround', value: '3-5 days', icon: Clock, color: 'text-blue-500' },
    { label: 'Quality Rating', value: '4.9/5', icon: Award, color: 'text-yellow-500' },
  ];

  const serviceCategories = [
    {
      title: "3D Printing Services",
      description: "Professional additive manufacturing for prototypes and production parts",
      icon: Printer,
      path: "/3d-printing",
      services: ["FDM Printing", "SLA Printing", "Multi-Material", "Post-Processing"],
      video: "/3d_printing.mp4",
      popularity: 5,
      category: "printing"
    },
    {
      title: "CNC Machining",
      description: "Precision subtractive manufacturing for metal and plastic components",
      icon: Settings,
      path: "/cnc-machining",
      services: ["3-Axis Milling", "4-Axis Milling", "Turning", "Surface Finishing"],
      video: "/cnc.mp4",
      popularity: 5,
      category: "machining"
    },
    {
      title: "Sheet Metal Fabrication",
      description: "Custom metalworking solutions from prototypes to production runs",
      icon: Layers,
      path: "/sheet-metal-fabrication",
      services: ["Laser Cutting", "Bending", "Welding", "Assembly"],
      video: "/sheet_metal.mp4",
      popularity: 4,
      category: "fabrication"
    },
    {
      title: "CAD Modeling",
      description: "Professional design services from concept to production-ready models",
      icon: Wrench,
      path: "/cad-modeling",
      services: ["3D Modeling", "Technical Drawings", "Design Optimization", "Reverse Engineering"],
      video: "/cad.mp4",
      popularity: 5,
      category: "design"
    },
    {
      title: "Laser Engraving",
      description: "Precision marking and customization for various materials",
      icon: Sparkles,
      path: "/laser-engraving",
      services: ["Engraving", "Etching", "Marking", "Personalization"],
      video: "/laser.mp4",
      popularity: 4,
      category: "finishing"
    },
    {
      title: "Manufacturing Solutions",
      description: "End-to-end production services and supply chain management",
      icon: Zap,
      path: "/manufacturing-solutions",
      services: ["Assembly", "Quality Control", "Packaging", "Logistics"],
      video: "/manufacturing.mp4",
      popularity: 5,
      category: "manufacturing"
    }
  ];

  // Filter and sort services
  const filteredServices = useMemo(() => {
    let filtered = serviceCategories;

    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter(service => service.category === filterCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.services.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort
    if (sortBy === 'name') {
      filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'popularity') {
      filtered = [...filtered].sort((a, b) => b.popularity - a.popularity);
    }

    return filtered;
  }, [searchQuery, sortBy, filterCategory]);

  const materialCategories = {
    plastics: [
      { name: "ABS", properties: ["Impact resistant", "Good heat resistance", "Easy to machine"], applications: ["Automotive", "Electronics", "Toys"], video: "/abs.mp4" },
      { name: "Nylon", properties: ["High strength", "Chemical resistant", "Self-lubricating"], applications: ["Gears", "Bearings", "Industrial parts"], video: "/nylon.mp4" },
      { name: "PLA", properties: ["Biodegradable", "Easy to print", "Good surface finish"], applications: ["Prototypes", "Educational", "Art projects"], video: "/plastic.mp4" },
      { name: "PETG", properties: ["Chemical resistant", "Clear options", "Food safe"], applications: ["Medical", "Food containers", "Display cases"], video: "/petg.mp4" },
      { name: "TPU", properties: ["Flexible", "Abrasion resistant", "Good elasticity"], applications: ["Gaskets", "Phone cases", "Athletic wear"], image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=300&h=200&fit=crop&q=80" },
      { name: "Polycarbonate", properties: ["High impact", "Temperature resistant", "Optical clarity"], applications: ["Safety equipment", "Automotive", "Medical devices"], video: "/polycarbon.mp4" }
    ],
    metals: [
      { name: "Aluminum", properties: ["Lightweight", "Corrosion resistant", "Good conductivity"], applications: ["Aerospace", "Automotive", "Electronics"], image: "https://images.unsplash.com/photo-1487887235947-a955ef187fcc?w=300&h=200&fit=crop&q=80" },
      { name: "Steel", properties: ["High strength", "Cost effective", "Magnetic"], applications: ["Construction", "Automotive", "Tools"], image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300&h=200&fit=crop&q=80" },
      { name: "Titanium", properties: ["Biocompatible", "Corrosion resistant", "High strength-to-weight"], applications: ["Medical", "Aerospace", "Marine"], image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300&h=200&fit=crop&q=80" },
      { name: "Copper", properties: ["Excellent conductivity", "Antimicrobial", "Malleable"], applications: ["Electronics", "Plumbing", "Heat exchangers"], image: "https://images.unsplash.com/photo-1487887235947-a955ef187fcc?w=300&h=200&fit=crop&q=80" }
    ],
    composites: [
      { name: "Carbon Fiber Reinforced", properties: ["Ultra-lightweight", "High stiffness", "Excellent strength"], applications: ["Aerospace", "Racing", "High-performance parts"], image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&h=200&fit=crop&q=80" },
      { name: "Glass-Filled Nylon", properties: ["Enhanced stiffness", "Reduced shrinkage", "Better heat resistance"], applications: ["Automotive", "Industrial", "Electrical components"], image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&h=200&fit=crop&q=80" }
    ],
    elastomers: [
      { name: "Silicone", properties: ["Temperature stable", "Chemical inert", "Biocompatible"], applications: ["Medical", "Food grade", "Seals"], image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=300&h=200&fit=crop&q=80" },
      { name: "TPE", properties: ["Recyclable", "Chemical resistant", "Flexible"], applications: ["Consumer goods", "Automotive", "Medical devices"], image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=300&h=200&fit=crop&q=80" }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Unified Hero Section */}
      <section className="relative pt-20 pb-16 bg-gradient-to-br from-primary/10 via-background to-secondary/10 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Factory className="w-12 h-12 text-primary" />
              </motion.div>
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Package className="w-12 h-12 text-secondary" />
              </motion.div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Services & <span className="text-primary">Materials</span>
            </h1>
            
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
                

                {/* Search and Filter Bar */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card/50 backdrop-blur-sm p-4 rounded-lg border"
                >
                  <div className="relative flex-1 w-full md:max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search services..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <div className="flex gap-2 w-full md:w-auto">
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger className="w-full md:w-[180px]">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="printing">Printing</SelectItem>
                        <SelectItem value="machining">Machining</SelectItem>
                        <SelectItem value="fabrication">Fabrication</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="finishing">Finishing</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                      <SelectTrigger className="w-full md:w-[180px]">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="name">Name (A-Z)</SelectItem>
                        <SelectItem value="popularity">Popularity</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>

                {/* Results count */}
                {searchQuery && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-muted-foreground"
                  >
                    Found {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''}
                  </motion.div>
                )}
                
                <AnimatePresence mode="wait">
                  {filteredServices.length > 0 ? (
                    <motion.div
                      key="services-grid"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                      {filteredServices.map((category, index) => (
                        <motion.div
                          key={category.title}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          layout
                        >
                          <ServiceCategory
                            title={category.title}
                            description={category.description}
                            icon={category.icon}
                            path={category.path}
                            services={category.services}
                            video={category.video}
                            popularity={category.popularity}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="no-results"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-12"
                    >
                      <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium text-muted-foreground mb-2">No services found</p>
                      <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchQuery('');
                          setFilterCategory('all');
                          setSortBy('default');
                        }}
                        className="mt-4"
                      >
                        Clear Filters
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </TabsContent>
            
            {/* Materials Content */}
            <TabsContent value="materials" className="mt-8">
              <motion.div
                id="materials-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-12"
              >
               
                
                <MaterialsTabs materialCategories={materialCategories} />
                
                {/* Additional Benefits Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="grid md:grid-cols-3 gap-8 mt-16 pt-12 border-t"
                >
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="text-center group"
                  >
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                      <CheckCircle2 className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Quality Assured</h3>
                    <p className="text-muted-foreground text-sm">
                      Every material batch tested for consistency and performance
                    </p>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="text-center group"
                  >
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                      <Zap className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Tech Integration</h3>
                    <p className="text-muted-foreground text-sm">
                      Smart material selection based on your application needs
                    </p>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="text-center group"
                  >
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                      <Award className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Sustainable Choice</h3>
                    <p className="text-muted-foreground text-sm">
                      Eco-friendly options available for environmentally conscious projects
                    </p>
                  </motion.div>
                </motion.div>
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

