
import React from 'react';

const TechnologyShowcase = () => {
  const technologies = [
    {
      title: "Precision Manufacturing",
      description: "Micron-level accuracy for critical applications",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=80&q=80"
    },
    {
      title: "Quality Control",
      description: "Rigorous testing at every stage of production",
      color: "polyform-green-500"
    },
    {
      title: "Fast Turnaround",
      description: "Rapid prototyping to production in record time",
      color: "polyform-green-400"
    },
    {
      title: "Sustainable Process",
      description: "Eco-friendly manufacturing with minimal waste",
      color: "polyform-green-300"
    }
  ];

  return (
    <section className="py-16 bg-gray-50 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <img 
          src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2000&q=80" 
          alt="Circuit pattern"
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Cutting-Edge Technology</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Powered by state-of-the-art equipment and innovative processes to deliver exceptional results
          </p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-8">
          {technologies.map((tech, index) => (
            <div key={index} className="text-center">
              <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center mx-auto mb-4 group hover:scale-110 transition-transform duration-300">
                {tech.image ? (
                  <img 
                    src={tech.image} 
                    alt="Precision technology"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className={`w-4 h-4 bg-${tech.color} rounded-full`}></div>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{tech.title}</h3>
              <p className="text-gray-600 text-sm">{tech.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechnologyShowcase;
