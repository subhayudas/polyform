
import React, { useState } from 'react';
import { Network, Target, Award, ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface ServiceCardsProps {
  onServiceCardClick?: (serviceType: string) => void;
}

const ServiceCards: React.FC<ServiceCardsProps> = ({ onServiceCardClick }) => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const navigate = useNavigate();

  const polyBidsFeatures = [
    {
      icon: Target,
      title: "Targeted RFQs",
      description: "Only qualified vendors see your project",
      features: ["Capability matching", "Material expertise", "Quality verified"]
    },
    {
      icon: Network,
      title: "Transparent Bidding",
      description: "See competitive bids in real-time",
      features: ["48-hour bid window", "Top 3 visible pricing", "Anonymous comparison"]
    },
    {
      icon: Award,
      title: "Verified Partners",
      description: "ISO-certified manufacturers only",
      features: ["Performance tracking", "Quality guarantees", "Delivery commitment"]
    }
  ];

  const manufacturingServices = ['CNC Machining', '3D Printing', 'Laser Cutting', 'Sheet Metal', 'Injection Molding'];

  const handleFeatureClick = (featureType: string) => {
    if (onServiceCardClick) {
      onServiceCardClick(featureType);
    }
    navigate(`/quote?service=${featureType}`);
  };

  return (
    <div className="space-y-6 relative">
      {/* SVG Filters for glass effect */}
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
        </defs>
      </svg>
      {/* PolyBids System Features */}
      <div className="space-y-4">
        <div className="text-center lg:text-left mb-4">
          <h3 className="text-xl font-semibold text-white mb-2">
            How PolyBids Works
          </h3>
          <p className="text-sm text-white/70">
            Our intelligent matching system connects you with the right manufacturers
          </p>
        </div>

        {polyBidsFeatures.map((feature, index) => {
          const IconComponent = feature.icon;
          const isHovered = hoveredCard === index;
          
          return (
            <Card 
              key={index}
              className="group cursor-pointer border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:border-primary/30 hover:bg-white/10"
              style={{
                filter: "url(#glass-effect)",
              }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => handleFeatureClick(feature.title.toLowerCase().replace(' ', '-'))}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/15 transition-colors">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="text-lg font-semibold text-white">
                        {feature.title}
                      </CardTitle>
                      <CardDescription className="text-sm text-white/70">
                        {feature.description}
                      </CardDescription>
                    </div>
                  </div>
                  <ArrowRight className={`h-5 w-5 text-white/60 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
                </div>
              </CardHeader>
              
              <CardContent className={`transition-all duration-300 ${isHovered ? 'pb-6' : 'pb-0 max-h-0 overflow-hidden'}`}>
                <div className="space-y-3 border-t border-white/10 pt-4">
                  <div className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <div key={idx} className="flex items-center text-xs text-white/70">
                        <CheckCircle className="w-3 h-3 mr-2 text-cyan-400" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Manufacturing Services */}
      <div className="space-y-4 text-center lg:text-left">
        <div>
          <p className="text-sm text-white/70 mb-3">Available Services:</p>
          <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
            {manufacturingServices.map((service) => (
              <Badge key={service} variant="outline" className="text-xs border-white/20 text-white/80 bg-white/5">
                {service}
              </Badge>
            ))}
          </div>
        </div>
        
        <motion.button
          className="w-full px-6 py-3 rounded-full bg-transparent border-2 border-white/30 text-white font-medium text-sm transition-all duration-300 hover:bg-white/10 hover:border-cyan-400/50 hover:text-cyan-100 cursor-pointer backdrop-blur-sm"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/quote')}
        >
          Start Your RFQ
        </motion.button>
      </div>
    </div>
  );
};

export default ServiceCards;
