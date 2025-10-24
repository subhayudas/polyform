
import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import FileUpload from '@/components/FileUpload';
import WhatsAppButton from '@/components/WhatsAppButton';
import AIChatbot from '@/components/AIChatbot';

const Upload = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-20 pb-12 bg-gradient-to-br from-polyform-green-50 to-polyform-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-polyform-green-800 mb-6">
              Upload Your Files
            </h1>
            <p className="text-xl text-polyform-green-600 max-w-3xl mx-auto">
              Upload your 3D models and documents to get started with your custom manufacturing project.
            </p>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FileUpload />
        </div>
      </section>

      <WhatsAppButton variant="fixed" />
      <AIChatbot />
      <Footer />
    </div>
  );
};

export default Upload;
