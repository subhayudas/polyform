
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import PartnersHero from '@/components/partners/PartnersHero';
import BenefitsSection from '@/components/partners/BenefitsSection';
import PartnerTypesSection from '@/components/partners/PartnerTypesSection';
import RequirementsSection from '@/components/partners/RequirementsSection';
import PartnersCTA from '@/components/partners/PartnersCTA';
import VendorApplicationForm from '@/components/partners/VendorApplicationForm';
import { Button } from '@/components/ui/button';

const Partners = () => {
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  return (
    <div className="min-h-screen">
      <Navigation />
      <PartnersHero />
      <BenefitsSection />
      <PartnerTypesSection />
      <RequirementsSection />
      
      {/* Application Form Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!showApplicationForm ? (
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Ready to Apply?
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Submit your vendor application to join our network of trusted manufacturing partners.
              </p>
              <Button 
                onClick={() => setShowApplicationForm(true)}
                size="lg"
                className="bg-polyform-green-600 hover:bg-polyform-green-700"
              >
                Start Application
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="text-center">
                <Button 
                  variant="outline"
                  onClick={() => setShowApplicationForm(false)}
                  className="mb-8"
                >
                  ← Back to Partner Information
                </Button>
              </div>
              <VendorApplicationForm />
            </div>
          )}
        </div>
      </section>
      
      <PartnersCTA />
      <WhatsAppButton variant="fixed" />
      <Footer />
    </div>
  );
};

export default Partners;
