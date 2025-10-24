
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import WhatsAppButton from '@/components/WhatsAppButton';

const ServiceHero: React.FC = () => {
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const handleVideoError = () => {
    console.log('Video failed to load, switching to fallback');
    setVideoError(true);
  };

  const handleVideoLoad = () => {
    console.log('Video loaded successfully');
    setVideoLoaded(true);
  };

  return (
    <section className="relative pt-20 pb-12 overflow-hidden">
      {!videoError ? (
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          autoPlay
          loop
          muted
          playsInline
          onError={handleVideoError}
          onLoadedData={handleVideoLoad}
          onCanPlay={() => console.log('Video can play')}
        >
          <source src="https://videos.pexels.com/video-files/8370724/8370724-uhd_2560_1440_30fps.mp4" type="video/mp4" />
          <source src="https://videos.pexels.com/video-files/3862267/3862267-hd_1920_1080_30fps.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-polyform-green-50 to-white z-0">
          <img 
            src="https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=2000&q=80" 
            alt="Modern manufacturing facility"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
      )}
      
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/40 z-5"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Manufacturing
            <span className="text-polyform-green-300 block">Services</span>
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-8">
            Comprehensive manufacturing solutions from rapid prototyping to high-volume production. 
            Professional-grade services with sustainable practices at every step.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/upload">
              <Button className="bg-polyform-green-600 hover:bg-polyform-green-700 text-lg px-8 py-3">
                Get Started Now
              </Button>
            </Link>
            <WhatsAppButton 
              size="lg"
              message="Hi! I'd like to know more about your manufacturing services."
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceHero;
