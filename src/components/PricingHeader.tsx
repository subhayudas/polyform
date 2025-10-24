
import React from 'react';

const PricingHeader = () => {
  return (
    <section className="pt-20 pb-10 bg-gradient-to-br from-polyform-green-100 to-polyform-sage-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-polyform-green-800 mb-4">
            Basic Pricing
          </h1>
          <p className="text-lg text-polyform-green-700 max-w-2xl mx-auto mb-6">
            For basic services you can see pricing below.
          </p>
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-5 max-w-3xl mx-auto border border-polyform-green-200">
            <p className="text-polyform-green-700 mb-3 text-sm leading-relaxed">
              Slant 3D focuses on large scale production of 3D printed parts. To accurately provide pricing for your project we have to have a 3D model and description of its function. You can submit all of this through our Quoting form.
            </p>
            <p className="text-xs text-polyform-green-600">
              All files and information submitted is kept completely confidential. You can view our privacy policy here.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingHeader;
