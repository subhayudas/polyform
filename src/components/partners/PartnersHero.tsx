
import React from 'react';
import { Button } from '@/components/ui/button';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const PartnersHero = () => {
  return (
    <section className="pt-20 pb-12 bg-gradient-to-br from-polyform-green-50 to-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-20 h-20 bg-polyform-green-600 rounded-full"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-polyform-green-400 rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-polyform-green-500 rounded-full"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Partner With
              <span className="text-polyform-green-600 block">PolyForm</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mb-8">
              Join our network of trusted manufacturers and suppliers. Expand your business, 
              access new markets, and collaborate on innovative projects.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/become-partner">
                <Button className="bg-polyform-green-600 hover:bg-polyform-green-700 text-lg px-8 py-3">
                  Apply to Partner
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <WhatsAppButton 
                size="lg"
                message="Hi! I'm interested in becoming a manufacturing partner with PolyForm."
              />
            </div>
          </div>
          
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Team collaboration" 
              className="rounded-lg shadow-2xl"
            />
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-polyform-green-600 rounded-lg opacity-20"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersHero;
