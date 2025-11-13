
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
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            How PolyBids Works
          </h3>
          <p className="text-sm text-gray-600">
            Our intelligent matching system connects you with the right manufacturers
          </p>
        </div>

        {polyBidsFeatures.map((feature, index) => {
          const IconComponent = feature.icon;
          const isHovered = hoveredCard === index;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card 
                className="group cursor-pointer border-gray-200 bg-white backdrop-blur-md transition-all duration-300 hover:shadow-xl hover:shadow-[hsl(var(--primary))]/20 hover:border-[hsl(var(--primary))]/40 hover:bg-[hsl(var(--primary))]/5 hover:-translate-y-1"
                style={{
                  filter: "url(#glass-effect)",
                }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => handleFeatureClick(feature.title.toLowerCase().replace(' ', '-'))}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] group-hover:bg-[hsl(var(--primary))]/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                        <IconComponent className="h-7 w-7" />
                      </div>
                      <div className="space-y-1">
                        <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-[hsl(var(--primary))] transition-colors">
                          {feature.title}
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-600">
                          {feature.description}
                        </CardDescription>
                      </div>
                    </div>
                    <ArrowRight className={`h-5 w-5 text-gray-400 transition-all duration-300 ${isHovered ? 'translate-x-2 text-[hsl(var(--primary))]' : ''}`} />
                  </div>
                </CardHeader>
                
                <CardContent className={`transition-all duration-300 ${isHovered ? 'pb-6' : 'pb-0 max-h-0 overflow-hidden'}`}>
                  <div className="space-y-3 border-t border-gray-200 pt-4">
                    <div className="space-y-2.5">
                      {feature.features.map((item, idx) => (
                        <div key={idx} className="flex items-center text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 mr-2 text-[hsl(var(--primary))] flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Manufacturing Services */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="space-y-5 text-center lg:text-left mt-8"
      >
        <div>
          <p className="text-sm font-medium text-gray-700 mb-4">Available Services:</p>
          <div className="flex flex-wrap gap-2.5 justify-center lg:justify-start">
            {manufacturingServices.map((service, idx) => (
              <motion.div
                key={service}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <Badge variant="outline" className="text-xs border-gray-300 text-gray-700 bg-white backdrop-blur-sm hover:bg-[hsl(var(--primary))]/10 hover:border-[hsl(var(--primary))]/50 hover:text-[hsl(var(--primary))] transition-all duration-300 px-3 py-1.5">
                  {service}
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>
        
        <motion.button
          className="w-full px-8 py-4 rounded-full bg-[hsl(var(--primary))]/10 border-2 border-[hsl(var(--primary))]/30 text-[hsl(var(--primary))] font-semibold text-sm transition-all duration-300 hover:bg-[hsl(var(--primary))] hover:border-[hsl(var(--primary))] hover:text-white cursor-pointer backdrop-blur-md group"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/quote')}
        >
          <span className="flex items-center justify-center gap-2">
            Start Your RFQ
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ServiceCards;
