
import React, { useState } from 'react';
import { Network, Target, Award, ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
    <div className="space-y-6">
      {/* PolyBids System Features */}
      <div className="space-y-4">
        <div className="text-center lg:text-left mb-4">
          <h3 className="text-xl font-semibold text-foreground mb-2">
            How PolyBids Works
          </h3>
          <p className="text-sm text-muted-foreground">
            Our intelligent matching system connects you with the right manufacturers
          </p>
        </div>

        {polyBidsFeatures.map((feature, index) => {
          const IconComponent = feature.icon;
          const isHovered = hoveredCard === index;
          
          return (
            <Card 
              key={index}
              className="group cursor-pointer border-border/50 bg-card transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20"
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
                      <CardTitle className="text-lg font-semibold">
                        {feature.title}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {feature.description}
                      </CardDescription>
                    </div>
                  </div>
                  <ArrowRight className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
                </div>
              </CardHeader>
              
              <CardContent className={`transition-all duration-300 ${isHovered ? 'pb-6' : 'pb-0 max-h-0 overflow-hidden'}`}>
                <div className="space-y-3 border-t border-border/50 pt-4">
                  <div className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <div key={idx} className="flex items-center text-xs text-muted-foreground">
                        <CheckCircle className="w-3 h-3 mr-2 text-primary" />
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
          <p className="text-sm text-muted-foreground mb-3">Available Services:</p>
          <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
            {manufacturingServices.map((service) => (
              <Badge key={service} variant="outline" className="text-xs">
                {service}
              </Badge>
            ))}
          </div>
        </div>
        
        <Button 
          className="w-full" 
          onClick={() => navigate('/quote')}
        >
          Start Your RFQ
        </Button>
      </div>
    </div>
  );
};

export default ServiceCards;
