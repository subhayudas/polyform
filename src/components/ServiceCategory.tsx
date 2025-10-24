
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface ServiceCategoryProps {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  services: string[];
  image?: string;
}

const ServiceCategory: React.FC<ServiceCategoryProps> = ({ 
  title, 
  description, 
  icon: Icon, 
  path, 
  services,
  image 
}) => {
  // Map service paths to quote service types
  const getQuoteServiceType = (servicePath: string) => {
    switch (servicePath) {
      case '/3d-printing':
        return '3d-printing';
      case '/cnc-machining':
        return 'cnc-machining';
      case '/sheet-metal-fabrication':
        return 'sheet-metal';
      case '/cad-modeling':
      case '/laser-engraving':
      case '/manufacturing-solutions':
        return 'prototyping';
      default:
        return '3d-printing';
    }
  };

  const quoteServiceType = getQuoteServiceType(path);

  return (
    <Card className="group relative overflow-hidden border-border/50 bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Image Section */}
      {image && (
        <div className="relative overflow-hidden">
          <AspectRatio ratio={16 / 9}>
            <img 
              src={image} 
              alt={`${title} service`}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
            <div className="absolute bottom-4 left-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/90 text-primary-foreground shadow-lg backdrop-blur-sm">
              <Icon className="h-7 w-7" />
            </div>
          </AspectRatio>
        </div>
      )}
      
      <CardHeader className="relative">
        {!image && (
          <div className="flex items-center space-x-4 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/15 transition-colors">
              <Icon className="h-6 w-6" />
            </div>
          </div>
        )}
        <div className="space-y-1">
          <CardTitle className="text-xl font-semibold leading-none">
            {title}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {description}
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {services.map((service, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs">
              {service}
            </Badge>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link to={path}>
              Learn More
            </Link>
          </Button>
          <Button asChild size="sm" className="flex-1">
            <Link to={`/quote?service=${quoteServiceType}`}>
              Get Quote
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCategory;
