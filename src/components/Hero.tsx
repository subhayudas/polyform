
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useNavigate, Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import { motion } from 'framer-motion';
import FileUpload from './FileUpload';
import HeroContent from './HeroContent';
import ServiceCards from './ServiceCards';
import VisualShowcase from './VisualShowcase';

const Hero = () => {
  const [isFileUploadOpen, setIsFileUploadOpen] = useState(false);
  const navigate = useNavigate();

  const handleUploadClick = () => {
    setIsFileUploadOpen(true);
  };

  const handleServiceCardClick = (serviceType: string) => {
    navigate(`/quote?service=${serviceType}`);
  };

  return (
    <div className="relative">
      {/* Main Hero Section with White Background */}
      <section className="relative pt-32 pb-24 bg-gradient-to-b from-white via-white to-gray-50 overflow-hidden">
        {/* Enhanced Animated Mesh Gradient Backgrounds */}
        <div className="absolute inset-0 w-full h-full">
          <motion.div
            className="absolute inset-0 w-full h-full opacity-100"
            style={{
              background: 'radial-gradient(circle at 20% 50%, rgba(144, 169, 85, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(144, 169, 85, 0.08) 0%, transparent 50%), radial-gradient(circle at 40% 20%, rgba(144, 169, 85, 0.06) 0%, transparent 50%), radial-gradient(circle at 60% 70%, rgba(144, 169, 85, 0.05) 0%, transparent 50%)',
            }}
            animate={{
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute inset-0 w-full h-full opacity-70"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(144, 169, 85, 0.1) 25%, rgba(144, 169, 85, 0.1) 75%, rgba(255, 255, 255, 0.9) 100%)',
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>

        {/* Enhanced Floating Light Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[
            { size: 200, left: 10, top: 20, color: 'rgba(144, 169, 85, 0.08)', x: 30, y: -20, duration: 12 },
            { size: 250, left: 80, top: 60, color: 'rgba(144, 169, 85, 0.08)', x: -40, y: 30, duration: 15 },
            { size: 180, left: 40, top: 80, color: 'rgba(144, 169, 85, 0.06)', x: 20, y: -30, duration: 14 },
            { size: 220, left: 70, top: 30, color: 'rgba(144, 169, 85, 0.06)', x: -25, y: 25, duration: 13 },
            { size: 190, left: 20, top: 70, color: 'rgba(144, 169, 85, 0.06)', x: 35, y: -35, duration: 16 },
            { size: 210, left: 90, top: 50, color: 'rgba(144, 169, 85, 0.06)', x: -30, y: 40, duration: 11 },
          ].map((config, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full blur-3xl"
              style={{
                width: `${config.size}px`,
                height: `${config.size}px`,
                left: `${config.left}%`,
                top: `${config.top}%`,
                backgroundColor: config.color,
              }}
              animate={{
                x: [0, config.x, 0],
                y: [0, config.y, 0],
                scale: [1, 1.3, 1],
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{
                duration: config.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
            />
          ))}
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(144, 169, 85, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(144, 169, 85, 0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Left Column - Hero Content */}
            <HeroContent onUploadClick={handleUploadClick} />

            {/* Right Column - Service Cards */}
            <ServiceCards onServiceCardClick={handleServiceCardClick} />
          </div>
        </div>

        {/* File Upload Dialog */}
        <Dialog open={isFileUploadOpen} onOpenChange={setIsFileUploadOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="sr-only">Upload Your RFQ Files</DialogTitle>
            </DialogHeader>
            <FileUpload />
          </DialogContent>
        </Dialog>
      </section>

      {/* Visual Showcase Section */}
      <VisualShowcase />

      {/* Vendor Partnership CTA Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-[hsl(var(--primary))]/5 dark:from-slate-900 dark:via-black dark:to-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--primary))]/10 border border-[hsl(var(--primary))]/20 mb-6">
              <Users className="w-4 h-4 text-[hsl(var(--primary))]" />
              <span className="text-sm font-medium text-[hsl(var(--primary))]">For Manufacturers</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Are You a Manufacturer?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Join our network of verified vendors and access targeted RFQs through PolyBids. 
              Grow your business with quality leads.
            </p>
            <Link to="/become-partner">
              <Button size="lg" className="gap-2 shadow-lg hover:shadow-xl transition-all duration-200 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-white border-0 px-8 py-6 text-base">
                <Users className="w-5 h-5" />
                Become a Partner
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
