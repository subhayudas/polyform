
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { LucideIcon, Star, Share2, ArrowRight } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ServiceCategoryProps {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  services: string[];
  image?: string;
  video?: string;
  popularity?: number;
}

const ServiceCategory: React.FC<ServiceCategoryProps> = ({ 
  title, 
  description, 
  icon: Icon, 
  path, 
  services,
  image,
  video,
  popularity = 4
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: window.location.origin + path,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.origin + path);
      alert('Link copied to clipboard!');
    }
  };
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
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className="group relative overflow-hidden border-border/50 bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 h-full flex flex-col">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Popularity Stars */}
        {popularity && (
          <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full border border-border/50">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-semibold">{popularity}.0</span>
          </div>
        )}

        {/* Share Button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 left-4 z-20 bg-background/80 backdrop-blur-sm hover:bg-background border border-border/50 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleShare();
                }}
                type="button"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Share Service</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      
        {/* Video/Image Section */}
        {(video || image) && (
          <div className="relative overflow-hidden">
            <AspectRatio ratio={16 / 9}>
              {video ? (
                <video 
                  src={video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className={`object-cover w-full h-full transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
                />
              ) : (
                <img 
                  src={image} 
                  alt={`${title} service`}
                  className={`object-cover w-full h-full transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
              <div className="absolute bottom-4 left-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/90 text-primary-foreground shadow-lg backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                <Icon className="h-7 w-7" />
              </div>
            </AspectRatio>
          </div>
        )}
      
        <CardHeader className="relative">
          {!(image || video) && (
            <div className="flex items-center space-x-4 mb-2">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/15 transition-colors"
              >
                <Icon className="h-6 w-6" />
              </motion.div>
            </div>
          )}
          <div className="space-y-1">
            <CardTitle className="text-xl font-semibold leading-none flex items-center justify-between">
              <span>{title}</span>
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground line-clamp-2">
              {description}
            </CardDescription>
          </div>
        </CardHeader>
      
        <CardContent className="space-y-4 flex-grow flex flex-col">
          <div className="flex flex-wrap gap-2">
            {services.slice(0, 3).map((service, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {service}
              </Badge>
            ))}
            {services.length > 3 && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Badge 
                    variant="outline" 
                    className="text-xs cursor-pointer hover:bg-primary/10 relative z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    +{services.length - 3} more
                  </Badge>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{title} - All Services</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-2 mt-4">
                    {services.map((service, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 rounded-md hover:bg-accent">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <span className="text-sm">{service}</span>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        
          <div className="flex gap-2 mt-auto pt-4">
            <Button 
              asChild 
              variant="outline" 
              size="sm" 
              className="flex-1 group/btn relative z-10"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Link 
                to={path} 
                className="flex items-center justify-center gap-2 w-full"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                Learn More
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button 
              asChild 
              size="sm" 
              className="flex-1 group/btn relative z-10"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Link 
                to={`/quote?service=${quoteServiceType}`} 
                className="flex items-center justify-center gap-2 w-full"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                Get Quote
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ServiceCategory;
