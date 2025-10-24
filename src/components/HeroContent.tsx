
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, BookOpen, Network } from 'lucide-react';
import TrustIndicators from './TrustIndicators';
import { Link } from 'react-router-dom';

interface HeroContentProps {
  onUploadClick: () => void;
}

const HeroContent = ({ onUploadClick }: HeroContentProps) => {
  return (
    <div className="text-center lg:text-left">
      <div className="animate-fade-in">
        <div className="inline-flex items-center bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
          <Network className="w-4 h-4 mr-2" />
          Manufacturing Aggregator Platform
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-8 leading-tight">
          Connect with
          <span className="text-primary block">
            Certified Vendors
          </span>
          Intelligently
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl leading-relaxed">
          PolyForm aggregates India's best manufacturers. Get transparent bids from 
          qualified vendors through our PolyBids system - CNC, 3D printing, laser cutting, and more.
        </p>

        {/* Enhanced CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
          <Button 
            className="px-8 py-4 text-lg hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            onClick={onUploadClick}
          >
            <Upload className="w-5 h-5 mr-2" />
            Upload RFQ
          </Button>
          <Button 
            variant="outline" 
            className="px-8 py-4 text-lg hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg group"
            asChild
          >
            <Link to="/services">
              <BookOpen className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Learn Manufacturing
            </Link>
          </Button>
        </div>

        {/* Educational CTA */}
        <div className="mb-8">
          <p className="text-sm text-muted-foreground mb-3">
            New to manufacturing? Explore our educational resources:
          </p>
          <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/services">Service Dictionary</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/materials">Material Guide</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/partners">Verified Partners</Link>
            </Button>
          </div>
        </div>

        {/* Trust Indicators */}
        <TrustIndicators />
      </div>
    </div>
  );
};

export default HeroContent;
