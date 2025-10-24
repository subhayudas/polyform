
import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import AIChatbot from '@/components/AIChatbot';
import PricingHeader from '@/components/PricingHeader';
import PricingCard from '@/components/PricingCard';
import PricingCallToAction from '@/components/PricingCallToAction';
import { Clock, Package, Warehouse, Wrench } from 'lucide-react';

const Pricing = () => {
  const pricingData = [
    {
      title: "Design",
      description: "Engineering and Design Services",
      icon: Wrench,
      imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=200&fit=crop",
      imageAlt: "CAD Design and Engineering",
      pricing: {
        primary: {
          amount: "$150",
          unit: "/hr"
        }
      },
      details: "Our Engineering and Design team has experience in the creation of engineering models, organic shapes, and industrial design. Please submit your product for review in order to get an estimated design time."
    },
    {
      title: "Prototyping 3D Printing",
      description: "Appearance & Production Prototypes",
      icon: Clock,
      imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=200&fit=crop",
      imageAlt: "3D Printing Prototyping Process",
      pricing: {
        primary: {
          amount: "$100",
          unit: "/standard size",
          label: "Appearance Prototype (PLA)"
        },
        secondary: {
          label: "Production Prototype",
          description: "Setup Fee + Print Cost"
        }
      },
      details: "Depending on your prototype needs there are some basic pricing available. If you are looking for a production prototype then please allow 1-2 weeks of preparation to ensure the part is optimized for production when you are ready to start."
    },
    {
      title: "Production 3D Printing",
      description: "Large Scale Production",
      icon: Package,
      imageUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=200&fit=crop",
      imageAlt: "Large Scale 3D Production Manufacturing",
      pricing: {
        custom: true
      },
      details: "Since each product and design is different it is impossible to provide an accurate automated quote. Please submit your design and one of our experienced account engineers will be in contact with estimated pricing and ways to optimize your product for production 3D printing."
    },
    {
      title: "Warehousing and Fulfillment",
      description: "Storage & Shipping Services",
      icon: Warehouse,
      imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=200&fit=crop",
      imageAlt: "Warehousing and Fulfillment Operations",
      pricing: {
        primary: {
          amount: "$0.75",
          unit: "/cubic foot",
          label: "Warehousing"
        },
        secondary: {
          label: "Pick and Pack",
          description: "$3.12/package"
        }
      },
      details: "When products are complete they must be sent to customers. We provide assembly, packaging, warehousing and fulfillment services to our clients. So you can reduce costs that come from moving production from 1 supplier to the next."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-polyform-green-50 to-polyform-sage-50">
      <Navigation />
      
      <PricingHeader />

      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingData.map((item, index) => (
              <PricingCard
                key={index}
                title={item.title}
                description={item.description}
                icon={item.icon}
                imageUrl={item.imageUrl}
                imageAlt={item.imageAlt}
                pricing={item.pricing}
                details={item.details}
              />
            ))}
          </div>

          <PricingCallToAction />
        </div>
      </section>

      <WhatsAppButton variant="fixed" />
      <AIChatbot />
      <Footer />
    </div>
  );
};

export default Pricing;
