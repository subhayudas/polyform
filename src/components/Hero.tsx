
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useNavigate, Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import FileUpload from './FileUpload';
import VideoBanner from './VideoBanner';
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
      {/* Video Banner Section */}
      <VideoBanner />

      {/* Main Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-background via-muted/20 to-background overflow-hidden">
        {/* Light Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-10 w-8 h-8 bg-primary/30 rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute top-1/3 right-16 w-6 h-6 bg-secondary/30 rounded-full animate-bounce opacity-60" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute bottom-1/3 left-1/4 w-4 h-4 bg-primary/40 rounded-full animate-bounce opacity-60" style={{ animationDelay: '2.5s' }}></div>
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
