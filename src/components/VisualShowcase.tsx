import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Target } from 'lucide-react';

const VisualShowcase = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover scale-105"
      >
        <source src="/backgroundvideo.mp4" type="video/mp4" />
      </video>
      
      {/* Enhanced Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/20 to-white/20 z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 z-10" />
      
      {/* Animated Grid Pattern Overlay */}
      <div className="absolute inset-0 z-10 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(144, 169, 85, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(144, 169, 85, 0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />
      </div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 z-10 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-[hsl(var(--primary))]/30 rounded-full blur-sm"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.sin(i) * 20, 0],
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}
      </div>
      
      {/* Content */}
      <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--primary))]/10 backdrop-blur-md border border-[hsl(var(--primary))]/20 mb-8"
        >
          <Sparkles className="w-4 h-4 text-[hsl(var(--primary))]" />
          <span className="text-sm font-medium text-gray-700">Next-Gen Manufacturing</span>
        </motion.div>

        {/* Main Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-gray-900 mb-6 tracking-tight"
        >
          <span className="block">Precision Manufacturing</span>
          <span className="block mt-3 bg-gradient-to-r from-[hsl(var(--primary))] via-gray-700 to-[hsl(var(--primary))] bg-clip-text text-transparent">
            Made Simple
          </span>
        </motion.h2>
        
        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-light mb-12"
        >
          Connect with verified manufacturers and bring your vision to life
        </motion.p>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4 max-w-3xl mx-auto"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--primary))]/10 backdrop-blur-md border border-[hsl(var(--primary))]/20">
            <Zap className="w-4 h-4 text-[hsl(var(--primary))]" />
            <span className="text-sm text-gray-700">Instant Quotes</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--primary))]/10 backdrop-blur-md border border-[hsl(var(--primary))]/20">
            <Target className="w-4 h-4 text-[hsl(var(--primary))]" />
            <span className="text-sm text-gray-700">Verified Partners</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--primary))]/10 backdrop-blur-md border border-[hsl(var(--primary))]/20">
            <Sparkles className="w-4 h-4 text-[hsl(var(--primary))]" />
            <span className="text-sm text-gray-700">Quality Guaranteed</span>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-[hsl(var(--primary))]/30 flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--primary))]/50"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default VisualShowcase;
