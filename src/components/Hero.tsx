
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
      {/* Main Hero Section with Dark Background */}
      <section className="relative pt-32 pb-24 bg-gradient-to-b from-black via-black to-slate-900 overflow-hidden">
        {/* Enhanced Animated Mesh Gradient Backgrounds */}
        <div className="absolute inset-0 w-full h-full">
          <motion.div
            className="absolute inset-0 w-full h-full opacity-100"
            style={{
              background: 'radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(22, 78, 99, 0.2) 0%, transparent 50%), radial-gradient(circle at 40% 20%, rgba(249, 115, 22, 0.15) 0%, transparent 50%), radial-gradient(circle at 60% 70%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)',
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
              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(6, 182, 212, 0.25) 25%, rgba(249, 115, 22, 0.25) 75%, rgba(255, 255, 255, 0.15) 100%)',
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
            { size: 200, left: 10, top: 20, color: 'rgba(6, 182, 212, 0.15)', x: 30, y: -20, duration: 12 },
            { size: 250, left: 80, top: 60, color: 'rgba(249, 115, 22, 0.15)', x: -40, y: 30, duration: 15 },
            { size: 180, left: 40, top: 80, color: 'rgba(6, 182, 212, 0.12)', x: 20, y: -30, duration: 14 },
            { size: 220, left: 70, top: 30, color: 'rgba(249, 115, 22, 0.12)', x: -25, y: 25, duration: 13 },
            { size: 190, left: 20, top: 70, color: 'rgba(6, 182, 212, 0.12)', x: 35, y: -35, duration: 16 },
            { size: 210, left: 90, top: 50, color: 'rgba(249, 115, 22, 0.12)', x: -30, y: 40, duration: 11 },
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
            backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px)',
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
      <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-cyan-50/30 dark:from-slate-900 dark:via-black dark:to-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
              <Users className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span className="text-sm font-medium text-cyan-700 dark:text-cyan-300">For Manufacturers</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Are You a Manufacturer?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Join our network of verified vendors and access targeted RFQs through PolyBids. 
              Grow your business with quality leads.
            </p>
            <Link to="/partners">
              <Button size="lg" className="gap-2 shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-cyan-500 to-orange-500 hover:from-cyan-400 hover:to-orange-400 text-white border-0 px-8 py-6 text-base">
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
