
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { Info, CheckCircle2, ArrowRight, Share2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useNavigate } from 'react-router-dom';

interface Material {
  name: string;
  properties: string[];
  applications: string[];
  image?: string;
}

interface MaterialCardProps {
  material: Material;
}

const MaterialCard = ({ material }: MaterialCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleShare = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (navigator.share) {
      try {
        await navigator.share({
          title: material.name,
          text: `Check out ${material.name} material for your project`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Material link copied to clipboard!');
    }
  };

  const handleSelectMaterial = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // Navigate to quote page with material selection
    navigate(`/quote?material=${encodeURIComponent(material.name)}`);
  };

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className="group relative overflow-hidden border-border/50 bg-card hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:border-primary/30 flex flex-col h-full">
        {/* Hover overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Info button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                type="button"
                className="absolute top-4 right-4 z-20 bg-background/80 backdrop-blur-sm hover:bg-background border border-border/50 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDialogOpen(true);
                }}
              >
                <Info className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>View Details</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Image Section */}
        {material.image && (
          <div className="relative overflow-hidden">
            <AspectRatio ratio={16 / 9}>
              <img 
                src={material.image} 
                alt={material.name}
                className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
            </AspectRatio>
          </div>
        )}

        <CardHeader className="flex-grow">
          <CardTitle className="text-xl font-semibold flex items-center justify-between gap-2">
            <span>{material.name}</span>
          </CardTitle>
          <CardDescription>
            High-performance material for demanding applications
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 flex-grow flex flex-col">
          <div>
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              Properties
            </h4>
            <div className="space-y-1.5">
              {material.properties.slice(0, 3).map((property, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{property}</span>
                </div>
              ))}
              {material.properties.length > 3 && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      type="button"
                      className="text-xs h-auto p-1 text-primary hover:text-primary/80 relative z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      +{material.properties.length - 3} more properties
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-2xl">{material.name}</DialogTitle>
                      <DialogDescription>
                        Comprehensive material information and specifications
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 mt-4">
                      {material.image && (
                        <div className="relative h-48 rounded-lg overflow-hidden">
                          <img 
                            src={material.image} 
                            alt={material.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                          Properties
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {material.properties.map((property, idx) => (
                            <div key={idx} className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent transition-colors">
                              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                              <span className="text-sm">{property}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-3">Applications</h3>
                        <div className="flex flex-wrap gap-2">
                          {material.applications.map((app, idx) => (
                            <Badge key={idx} variant="secondary" className="text-sm">
                              {app}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <DialogFooter className="flex gap-2 sm:gap-0">
                      <Button 
                        variant="outline" 
                        type="button"
                        onClick={(e) => handleShare(e)}
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                      <Button 
                        type="button"
                        onClick={(e) => handleSelectMaterial(e)} 
                        className="flex-1 sm:flex-initial"
                      >
                        Select Material
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-2">Applications</h4>
            <div className="flex flex-wrap gap-1.5">
              {material.applications.slice(0, 3).map((app, idx) => (
                <Badge 
                  key={idx}
                  variant="secondary" 
                  className="text-xs"
                >
                  {app}
                </Badge>
              ))}
              {material.applications.length > 3 && (
                <Badge variant="outline" className="text-xs cursor-default">
                  +{material.applications.length - 3}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex gap-2 mt-auto pt-4 relative z-10">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  type="button"
                  className="flex-1 group/btn"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Info className="w-4 h-4 mr-2" />
                  Details
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl">{material.name}</DialogTitle>
                  <DialogDescription>
                    Comprehensive material information and specifications
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 mt-4">
                  {material.image && (
                    <div className="relative h-48 rounded-lg overflow-hidden">
                      <img 
                        src={material.image} 
                        alt={material.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                      Properties
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {material.properties.map((property, idx) => (
                        <div key={idx} className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent transition-colors">
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                          <span className="text-sm">{property}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Applications</h3>
                    <div className="flex flex-wrap gap-2">
                      {material.applications.map((app, idx) => (
                        <Badge key={idx} variant="secondary" className="text-sm">
                          {app}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter className="flex gap-2 sm:gap-0">
                  <Button 
                    variant="outline" 
                    type="button"
                    onClick={(e) => handleShare(e)}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button 
                    type="button"
                    onClick={(e) => handleSelectMaterial(e)} 
                    className="flex-1 sm:flex-initial"
                  >
                    Select Material
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button 
              size="sm" 
              type="button"
              className="flex-1 group/btn"
              onClick={(e) => handleSelectMaterial(e)}
            >
              Select
              <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MaterialCard;
