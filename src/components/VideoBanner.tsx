
import React, { useState } from 'react';

const VideoBanner = () => {
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const handleVideoError = () => {
    console.log('Video failed to load');
    setVideoError(true);
  };

  const handleVideoLoad = () => {
    console.log('Video loaded successfully');
    setVideoLoaded(true);
  };

  return (
    <section className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden bg-gray-900 block">
      {!videoError ? (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          onError={handleVideoError}
          onLoadedData={handleVideoLoad}
        >
          <source src="https://videos.pexels.com/video-files/3195394/3195394-hd_1920_1080_25fps.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          <p className="text-white text-lg">3D Printing Technology</p>
        </div>
      )}
      
      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      
      {/* Video content overlay with just the main title */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
            Precision 3D Printing
          </h2>
        </div>
      </div>
    </section>
  );
};

export default VideoBanner;
