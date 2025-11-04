
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
import StatsSection from './StatsSection';

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
      {/* Main Hero Section with Dark Background */}
      <section className="relative pt-24 pb-16 bg-black overflow-hidden">
        {/* Animated Mesh Gradient Backgrounds */}
        <div className="absolute inset-0 w-full h-full">
          <motion.div
            className="absolute inset-0 w-full h-full opacity-100"
            style={{
              background: 'radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(22, 78, 99, 0.15) 0%, transparent 50%), radial-gradient(circle at 40% 20%, rgba(249, 115, 22, 0.1) 0%, transparent 50%)',
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
            className="absolute inset-0 w-full h-full opacity-60"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(6, 182, 212, 0.2) 25%, rgba(249, 115, 22, 0.2) 75%, rgba(255, 255, 255, 0.1) 100%)',
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

        {/* Floating Light Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[
            { size: 150, left: 10, top: 20, color: 'rgba(6, 182, 212, 0.1)', x: 30, y: -20, duration: 12 },
            { size: 200, left: 80, top: 60, color: 'rgba(249, 115, 22, 0.1)', x: -40, y: 30, duration: 15 },
            { size: 120, left: 40, top: 80, color: 'rgba(6, 182, 212, 0.1)', x: 20, y: -30, duration: 14 },
            { size: 180, left: 70, top: 30, color: 'rgba(249, 115, 22, 0.1)', x: -25, y: 25, duration: 13 },
            { size: 140, left: 20, top: 70, color: 'rgba(6, 182, 212, 0.1)', x: 35, y: -35, duration: 16 },
            { size: 160, left: 90, top: 50, color: 'rgba(249, 115, 22, 0.1)', x: -30, y: 40, duration: 11 },
          ].map((config, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full blur-2xl"
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
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
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

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
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

      {/* Stats Section */}
      <StatsSection />

      {/* Vendor Partnership CTA Section */}
      <section className="py-12 bg-gradient-to-br from-muted/30 to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Are You a Manufacturer?
          </h2>
          <p className="text-base text-muted-foreground mb-6 max-w-xl mx-auto leading-relaxed">
            Join our network of verified vendors and access targeted RFQs through PolyBids.
          </p>
          <Link to="/partners">
            <Button size="lg" className="gap-2 shadow-lg hover:shadow-xl transition-all duration-200">
              <Users className="w-5 h-5" />
              Become a Partner
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Hero;
