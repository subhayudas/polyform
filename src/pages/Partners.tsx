
import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import PartnersHero from '@/components/partners/PartnersHero';
import BenefitsSection from '@/components/partners/BenefitsSection';
import PartnerTypesSection from '@/components/partners/PartnerTypesSection';
import RequirementsSection from '@/components/partners/RequirementsSection';
import PartnersCTA from '@/components/partners/PartnersCTA';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Partners = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <PartnersHero />
      <BenefitsSection />
      <PartnerTypesSection />
      <RequirementsSection />
      
      {/* Application CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Ready to Apply?
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Submit your vendor application to join our network of trusted manufacturing partners.
              </p>
            <Link to="/become-partner">
              <Button 
                size="lg"
                className="bg-polyform-green-600 hover:bg-polyform-green-700"
              >
                Start Application
              </Button>
            </Link>
            </div>
        </div>
      </section>
      
      <PartnersCTA />
      <WhatsAppButton variant="fixed" />
      <Footer />
    </div>
  );
};

export default Partners;
