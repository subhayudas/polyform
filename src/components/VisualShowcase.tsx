import React from 'react';

const VisualShowcase = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/backgroundvideo.mp4" type="video/mp4" />
      </video>
      
      {/* Gradient Overlay for Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60 z-10" />
      
      {/* Content */}
      <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
          Precision Manufacturing
          <span className="block mt-2 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            Made Simple
          </span>
        </h2>
        <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed font-light">
          Connect with verified manufacturers and bring your vision to life
        </p>
      </div>
    </section>
  );
};

export default VisualShowcase;
