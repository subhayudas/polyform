import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import PartnersHero from '@/components/partners/PartnersHero';
import BenefitsSection from '@/components/partners/BenefitsSection';
import RequirementsSection from '@/components/partners/RequirementsSection';
import VendorApplicationForm from '@/components/partners/VendorApplicationForm';

const BecomePartner = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <PartnersHero />
      <BenefitsSection />
      <RequirementsSection />
      
      {/* Application Form Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Submit Your Application
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Fill out the form below to apply and join our network of trusted manufacturing partners.
            </p>
          </div>
          <VendorApplicationForm />
        </div>
      </section>
      
      <WhatsAppButton variant="fixed" />
      <Footer />
    </div>
  );
};

export default BecomePartner;

