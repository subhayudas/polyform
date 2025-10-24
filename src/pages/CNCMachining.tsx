import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import AIChatbot from "@/components/AIChatbot";
import DefinitionSection from "@/components/service-page/DefinitionSection";
import MaterialsGrid from "@/components/service-page/MaterialsGrid";
import AdvantagesComparison from "@/components/service-page/AdvantagesComparison";
import ApplicationsShowcase from "@/components/service-page/ApplicationsShowcase";
import TechniqueCard from "@/components/service-page/TechniqueCard";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

const CNCMachining = () => {
  const processes = [
    {
      title: "3-Axis Milling",
      description: "Standard CNC milling with movement along X, Y, and Z axes for versatile part production.",
      features: [
        "Ideal for flat and simple contoured parts",
        "Cost-effective for most applications",
        "Fast setup and production",
        "Wide material compatibility"
      ],
      image: "https://images.unsplash.com/photo-1565008576549-57569a49371d?w=800&q=80",
      capabilities: ["Precision: ±0.005\"", "Surface Finish: 32-125 Ra"]
    },
    {
      title: "4-Axis Milling",
      description: "Enhanced milling with rotational axis for complex geometries and reduced setups.",
      features: [
        "Complex curved surfaces",
        "Reduced setup time",
        "Better surface finish",
        "Undercut capabilities"
      ],
      image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80",
      capabilities: ["Precision: ±0.003\"", "Complex Geometries"]
    },
    {
      title: "CNC Turning",
      description: "Rotational machining for cylindrical parts with exceptional precision and surface quality.",
      features: [
        "Perfect for cylindrical parts",
        "High-speed production",
        "Excellent concentricity",
        "Threading capabilities"
      ],
      image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80",
      capabilities: ["Precision: ±0.002\"", "Surface Finish: 16-63 Ra"]
    },
    {
      title: "Surface Finishing",
      description: "Post-machining processes to achieve desired surface quality and aesthetic appearance.",
      features: [
        "Anodizing for aluminum",
        "Polishing and buffing",
        "Powder coating",
        "Bead blasting"
      ],
      image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80",
      capabilities: ["Ra: 8-125", "Various Colors", "Protective Coatings"]
    }
  ];

  const materials = [
    {
      name: "Aluminum",
      grades: ["6061-T6", "7075-T6", "2024"],
      properties: ["Lightweight", "Corrosion Resistant", "Good Machinability"],
      description: "Most common CNC material, excellent strength-to-weight ratio"
    },
    {
      name: "Stainless Steel",
      grades: ["304", "316", "303"],
      properties: ["High Strength", "Corrosion Resistant", "Food Safe"],
      description: "Ideal for medical, food, and marine applications"
    },
    {
      name: "Brass",
      properties: ["Low Friction", "Decorative", "Antimicrobial"],
      description: "Excellent for fittings, decorative parts, and electrical components"
    },
    {
      name: "Titanium",
      grades: ["Grade 2", "Grade 5"],
      properties: ["Biocompatible", "High Strength", "Lightweight"],
      description: "Aerospace and medical grade material"
    },
    {
      name: "Engineering Plastics",
      grades: ["ABS", "Delrin (POM)", "Acrylic", "PEEK"],
      properties: ["Chemical Resistant", "Insulating", "Cost Effective"],
      description: "Perfect for prototypes and functional parts"
    },
    {
      name: "Copper",
      properties: ["Excellent Conductivity", "Thermal", "Antimicrobial"],
      description: "Electrical and thermal applications"
    }
  ];

  const advantages = [
    "Exceptional precision and tight tolerances (±0.002\" - ±0.005\")",
    "Superior surface finish quality (Ra 8-125)",
    "Wide range of compatible materials including metals and plastics",
    "High repeatability for production runs",
    "Excellent for functional, load-bearing parts",
    "Established industry standards and specifications"
  ];

  const limitations = [
    "Higher cost for complex geometries compared to additive methods",
    "Material waste from subtractive process",
    "Longer setup time for low-volume production",
    "Some geometric limitations (e.g., internal cavities)",
    "Tool access constraints for certain designs"
  ];

  const applications = [
    {
      industry: "Aerospace",
      icon: "✈️",
      examples: ["Structural Components", "Engine Parts", "Landing Gear", "Brackets"]
    },
    {
      industry: "Automotive",
      icon: "🚗",
      examples: ["Engine Blocks", "Transmission Parts", "Custom Fixtures", "Prototypes"]
    },
    {
      industry: "Medical Devices",
      icon: "🏥",
      examples: ["Surgical Instruments", "Implants", "Diagnostic Equipment", "Prototypes"]
    },
    {
      industry: "Electronics",
      icon: "💻",
      examples: ["Enclosures", "Heat Sinks", "Mounting Brackets", "Connectors"]
    },
    {
      industry: "Robotics",
      icon: "🤖",
      examples: ["Structural Parts", "Gears", "Housings", "Custom Components"]
    },
    {
      industry: "Industrial",
      icon: "🏭",
      examples: ["Tooling", "Fixtures", "Jigs", "Machine Parts"]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1565008576549-57569a49371d?w=1920&q=80"
            alt="CNC Machining"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 to-background/70" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Precision CNC Machining
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-fade-in">
            Advanced subtractive manufacturing for tight tolerances and superior surface finishes
          </p>
          <div className="flex gap-4 justify-center animate-fade-in">
            <Button size="lg" className="gap-2">
              Get Quote
            </Button>
            <WhatsAppButton variant="outline" size="lg" />
          </div>
        </div>
      </section>

      {/* Definition Section */}
      <DefinitionSection
        title="What is CNC Machining?"
        type="Subtractive Manufacturing"
        description="Computer Numerical Control (CNC) machining is a subtractive manufacturing process that removes material from a solid workpiece using computer-controlled cutting tools. This method delivers exceptional precision, repeatability, and surface quality for both prototypes and production parts."
        benefits={[
          "Tolerances as tight as ±0.002 inches",
          "Excellent surface finish without post-processing",
          "Works with metals, plastics, and composites",
          "Ideal for functional, load-bearing components"
        ]}
        icon={Settings}
      />

      {/* CNC Processes */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">CNC Machining Processes</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {processes.map((process, index) => (
            <TechniqueCard key={index} {...process} />
          ))}
        </div>
      </div>

      {/* Materials Grid */}
      <MaterialsGrid materials={materials} title="Compatible Materials" />

      {/* Advantages & Limitations */}
      <AdvantagesComparison advantages={advantages} limitations={limitations} />

      {/* Applications */}
      <ApplicationsShowcase applications={applications} />

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your CNC Project?</h2>
          <p className="text-xl mb-8 opacity-90">
            Get precision parts machined to your exact specifications
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" variant="secondary">
              Upload CAD Files
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              Contact Engineering Team
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton variant="fixed" />
      <AIChatbot />
    </div>
  );
};

export default CNCMachining;
