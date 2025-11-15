
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import AIChatbot from '@/components/AIChatbot';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Users, Target, Award, Clock } from 'lucide-react';

const About = () => {
  const navigate = useNavigate();
  const stats = [
    { icon: Users, label: "Happy Clients", value: "500+" },
    { icon: Target, label: "Projects Completed", value: "2,000+" },
    { icon: Award, label: "Years Experience", value: "10+" },
    { icon: Clock, label: "Average Delivery", value: "3-5 Days" }
  ];

  const values = [
    {
      title: "Quality First",
      description: "We never compromise on quality. Every project undergoes rigorous quality control."
    },
    {
      title: "Innovation",
      description: "Staying at the forefront of manufacturing technology and processes."
    },
    {
      title: "Customer Focus", 
      description: "Your success is our success. We're committed to exceeding expectations."
    },
    {
      title: "Sustainability",
      description: "Environmentally responsible manufacturing practices for a better future."
    }
  ];

  const capabilities = [
    "Advanced 3D Printing Technologies",
    "Precision CNC Machining",
    "Sheet Metal Fabrication",
    "Quality Assurance & Testing",
    "Design for Manufacturing (DFM)",
    "Rapid Prototyping Services"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                About <span className="text-primary">Polyform</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Leading the future of digital manufacturing with cutting-edge technology, 
                exceptional quality, and unmatched customer service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center space-y-3">
                  <div className="flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <IconComponent className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tight">Our Story</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Founded with a vision to democratize manufacturing, Polyform has grown from a small 
                  startup to a leading provider of digital manufacturing services. We believe that 
                  great ideas shouldn't be limited by manufacturing constraints.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Our team of engineers, designers, and manufacturing experts work tirelessly to 
                  bring your concepts to life with precision, speed, and reliability. From rapid 
                  prototyping to full-scale production, we're your trusted manufacturing partner.
                </p>
              </div>
              <Button size="lg" asChild>
                <Link to="/quote">
                  Get Started Today
                </Link>
              </Button>
            </div>
            <div className="lg:order-first">
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop" 
                alt="Manufacturing facility"
                className="rounded-lg shadow-lg w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Our Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center h-full">
                <CardHeader>
                  <CardTitle className="text-lg">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="leading-relaxed">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Our Capabilities</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Advanced manufacturing technologies at your service
            </p>
          </div>
          
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                {capabilities.map((capability, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="h-2 w-2 bg-primary rounded-full flex-shrink-0" />
                    <span className="text-sm">{capability}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <WhatsAppButton variant="fixed" />
      <AIChatbot />
      <Footer />
    </div>
  );
};

export default About;
