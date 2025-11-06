import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, BookOpen, Network } from 'lucide-react';
import TrustIndicators from './TrustIndicators';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface HeroContentProps {
  onUploadClick: () => void;
}

const HeroContent = ({ onUploadClick }: HeroContentProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleMouseEnter = () => setIsActive(true);
    const handleMouseLeave = () => setIsActive(false);
    const container = containerRef.current;

    if (container) {
      container.addEventListener("mouseenter", handleMouseEnter);
      container.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener("mouseenter", handleMouseEnter);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="relative text-center lg:text-left">
      {/* SVG Filters */}
      <svg className="absolute inset-0 w-0 h-0">
        <defs>
          <filter id="glass-effect" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence baseFrequency="0.005" numOctaves="1" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.3" />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0.02
                      0 1 0 0 0.02
                      0 0 1 0 0.05
                      0 0 0 0.9 0"
              result="tint"
            />
          </filter>

          <filter id="text-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="hero-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="#90A955" />
            <stop offset="70%" stopColor="#90A955" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
        </defs>
      </svg>

      {/* Animated Background Gradient */}
      <div className="absolute inset-0 -z-10 opacity-30">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-[#90A955]/20 via-[#90A955]/15 to-[#90A955]/10 rounded-3xl blur-3xl"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <div className="relative">
        {/* Badge */}
        <motion.div
          className="inline-flex items-center px-4 py-2 rounded-full bg-[#90A955]/10 backdrop-blur-sm mb-6 relative border border-[#90A955]/20"
          style={{
            filter: "url(#glass-effect)",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="absolute top-0 left-1 right-1 h-px bg-gradient-to-r from-transparent via-[#90A955]/30 to-transparent rounded-full" />
          <Network className="w-4 h-4 mr-2 text-[#90A955]" />
          <span className="text-gray-700 text-sm font-medium relative z-10 tracking-wide">
            Manufacturing Aggregator Platform
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold text-white mb-8 leading-none tracking-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          
          <span className="block font-black text-[#90A955] drop-shadow-2xl mb-2">Certified Vendors</span>
          <span className="block font-light text-gray-600 italic text-2xl md:text-3xl lg:text-4xl xl:text-5xl">Intelligently</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          className="text-lg md:text-xl lg:text-2xl text-gray-700 mb-10 max-w-2xl leading-relaxed mx-auto lg:mx-0 font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          PolyForm aggregates India's best manufacturers. Get transparent bids from 
          qualified vendors through our PolyBids system - CNC, 3D printing, laser cutting, and more.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <motion.button
            className="px-12 py-5 rounded-full bg-[#90A955] text-white font-semibold text-base transition-all duration-300 hover:bg-[#90A955]/90 cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-[#90A955]/50 flex items-center justify-center gap-3 group"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onUploadClick}
          >
            <Upload className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            Upload RFQ
          </motion.button>
          
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              to="/services"
              className="px-12 py-5 rounded-full bg-transparent border-2 border-[#90A955]/30 text-[#90A955] font-medium text-base transition-all duration-300 hover:bg-[#90A955]/10 hover:border-[#90A955]/50 hover:text-[#90A955] cursor-pointer backdrop-blur-md flex items-center justify-center gap-3 group"
            >
              <BookOpen className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              Learn Manufacturing
            </Link>
          </motion.div>
        </motion.div>

        {/* Educational CTA */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <p className="text-sm text-gray-600 mb-3">
            New to manufacturing? Explore our educational resources:
          </p>
          <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/services" className="hover:bg-[#90A955]/10 text-gray-700 hover:text-[#90A955]">
                Service Dictionary
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/materials" className="hover:bg-[#90A955]/10 text-gray-700 hover:text-[#90A955]">
                Material Guide
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/partners" className="hover:bg-[#90A955]/10 text-gray-700 hover:text-[#90A955]">
                Verified Partners
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <TrustIndicators />
      </div>
    </div>
  );
};

export default HeroContent;
