
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Network, Target, Clock, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const VisualShowcase = () => {
  const polyBidsProcess = [
    {
      step: "1",
      title: "Upload RFQ",
      description: "Submit your manufacturing requirements with files and specifications",
      icon: Network,
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80"
    },
    {
      step: "2", 
      title: "Smart Matching",
      description: "Our system routes your RFQ only to vendors with the right capabilities",
      icon: Target,
      image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=800&q=80"
    },
    {
      step: "3",
      title: "Transparent Bidding",
      description: "Qualified vendors submit competitive bids within 48 hours",
      icon: Clock,
      image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80"
    },
    {
      step: "4",
      title: "Verified Delivery",
      description: "ISO-certified partners deliver quality parts on time",
      icon: Shield,
      image: "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How PolyBids Transforms Manufacturing
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our intelligent platform eliminates guesswork and connects you with the right manufacturers every time
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {polyBidsProcess.map((process, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-border/50">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={process.image} 
                  alt={process.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 flex items-center">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm mr-3">
                    {process.step}
                  </div>
                  <process.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-2">{process.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{process.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Educational Resources CTA */}
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <h3 className="text-2xl font-semibold text-foreground mb-4">
            New to Manufacturing?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Explore our comprehensive educational resources to understand materials, 
            processes, and make informed decisions for your projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link to="/services">
                Service Dictionary
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/materials">
                Material Guide
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/partners">
                Verified Partners
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisualShowcase;
