
import React from 'react';
import { Button } from '@/components/ui/button';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Link } from 'react-router-dom';
import { Users, ArrowRight } from 'lucide-react';

const PartnersCTA = () => {
  return (
    <section className="py-16 bg-polyform-green-600 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 border-2 border-white rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border-2 border-white rounded-full"></div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <Users className="w-16 h-16 text-white mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to Join Our Partner Network?
        </h2>
        <p className="text-xl text-polyform-green-100 mb-8 max-w-2xl mx-auto">
          Start your partnership journey with PolyForm today. Together, we can create 
          innovative solutions and expand our market reach.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/become-partner">
            <Button variant="outline" className="bg-white text-polyform-green-600 hover:bg-gray-50 text-lg px-8 py-3 border-white">
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <WhatsAppButton 
            variant="outline"
            size="lg"
            message="Hi! I'd like to discuss becoming a manufacturing partner with PolyForm."
          />
        </div>
      </div>
    </section>
  );
};

export default PartnersCTA;
