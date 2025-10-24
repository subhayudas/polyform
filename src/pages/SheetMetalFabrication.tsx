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
import { Card, CardContent } from "@/components/ui/card";
import { Layers } from "lucide-react";

const SheetMetalFabrication = () => {
  const processes = [
    {
      title: "Laser Cutting",
      description: "High-precision cutting of sheet metal using focused laser beams for intricate designs and clean edges.",
      features: [
        "Exceptional edge quality",
        "Complex shapes and fine details",
        "Minimal material waste",
        "No tool wear or replacement"
      ],
      image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80",
      capabilities: ["Thickness: 0.5mm - 25mm", "Tolerance: ±0.1mm"]
    },
    {
      title: "CNC Bending",
      description: "Precision sheet metal bending and forming to create angles, channels, and complex 3D shapes.",
      features: [
        "Consistent bend angles",
        "Repeatable production",
        "Complex multi-bend parts",
        "Minimal springback"
      ],
      image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80",
      capabilities: ["Bend Angle: ±0.5°", "Max Length: 3000mm"]
    },
    {
      title: "Welding & Assembly",
      description: "Professional welding services including TIG, MIG, and spot welding for robust assemblies.",
      features: [
        "TIG welding for precision",
        "MIG welding for production",
        "Spot welding for thin sheets",
        "Clean weld seams"
      ],
      image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80",
      capabilities: ["TIG", "MIG", "Spot Welding", "Assembly"]
    },
    {
      title: "Surface Treatment",
      description: "Finishing processes including powder coating, anodizing, and galvanizing for protection and aesthetics.",
      features: [
        "Powder coating in custom colors",
        "Anodizing for aluminum",
        "Galvanizing for corrosion resistance",
        "Polishing and brushing"
      ],
      image: "https://images.unsplash.com/photo-1562408590-e32931084e23?w=800&q=80",
      capabilities: ["Powder Coat", "Anodize", "Galvanize", "Polish"]
    }
  ];

  const materials = [
    {
      name: "Mild Steel",
      grades: ["SPCC", "SPHC", "Q235"],
      properties: ["Cost Effective", "Good Weldability", "Formable"],
      description: "Versatile material for general fabrication and structural applications"
    },
    {
      name: "Stainless Steel",
      grades: ["304", "316", "430"],
      properties: ["Corrosion Resistant", "Hygienic", "Durable"],
      description: "Ideal for food, medical, and outdoor applications"
    },
    {
      name: "Aluminum",
      grades: ["5052", "6061", "1060"],
      properties: ["Lightweight", "Corrosion Resistant", "Good Conductivity"],
      description: "Perfect for weight-sensitive and outdoor applications"
    },
    {
      name: "Galvanized Steel",
      properties: ["Rust Resistant", "Durable", "Cost Effective"],
      description: "Zinc coating provides excellent corrosion protection"
    },
    {
      name: "Brass",
      properties: ["Decorative", "Antimicrobial", "Low Friction"],
      description: "Architectural and decorative applications"
    },
    {
      name: "Copper",
      properties: ["Electrical Conductivity", "Thermal", "Antimicrobial"],
      description: "Electrical enclosures and heat management"
    }
  ];

  const advantages = [
    "Excellent strength-to-weight ratio for structural applications",
    "Cost-effective for medium to high volume production",
    "Fast turnaround with automated processes",
    "Durable and long-lasting finished products",
    "Wide range of surface finishes and colors available",
    "Scalable from prototype to mass production"
  ];

  const limitations = [
    "Limited to simpler geometric shapes compared to 3D printing",
    "Tooling setup costs for complex bends",
    "Minimum thickness constraints (typically 0.5mm)",
    "Bend radii limitations based on material thickness",
    "Material waste on complex cutting patterns"
  ];

  const applications = [
    {
      industry: "Electronics",
      icon: "💻",
      examples: ["Server Racks", "Control Panels", "Enclosures", "Chassis"]
    },
    {
      industry: "Automotive",
      icon: "🚗",
      examples: ["Body Panels", "Brackets", "Frames", "Exhaust Systems"]
    },
    {
      industry: "HVAC",
      icon: "❄️",
      examples: ["Ductwork", "Vents", "Air Handlers", "Panels"]
    },
    {
      industry: "Furniture",
      icon: "🪑",
      examples: ["Frames", "Supports", "Decorative Elements", "Cabinets"]
    },
    {
      industry: "Industrial",
      icon: "🏭",
      examples: ["Machine Guards", "Covers", "Housings", "Brackets"]
    },
    {
      industry: "Architecture",
      icon: "🏢",
      examples: ["Cladding", "Railings", "Decorative Panels", "Signage"]
    }
  ];

  const thicknessGuide = [
    { thickness: "0.5mm - 1.5mm", uses: "Electronics enclosures, decorative panels" },
    { thickness: "1.5mm - 3mm", uses: "General fabrication, brackets, covers" },
    { thickness: "3mm - 6mm", uses: "Structural components, frames, heavy-duty enclosures" },
    { thickness: "6mm - 25mm", uses: "Industrial machinery, heavy equipment, structural steel" }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1920&q=80"
            alt="Sheet Metal Fabrication"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 to-background/70" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Sheet Metal Fabrication
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-fade-in">
            Precision forming and cutting for durable, cost-effective metal parts and assemblies
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
        title="What is Sheet Metal Fabrication?"
        type="Forming & Cutting"
        description="Sheet metal fabrication is the process of forming and cutting flat metal sheets into functional parts through laser cutting, bending, welding, and assembly. This manufacturing method delivers strong, lightweight components ideal for enclosures, brackets, frames, and structural applications."
        benefits={[
          "High strength-to-weight ratio",
          "Cost-effective for volume production",
          "Excellent durability and longevity",
          "Wide range of finishing options"
        ]}
        icon={Layers}
      />

      {/* Fabrication Processes */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Fabrication Processes</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {processes.map((process, index) => (
            <TechniqueCard key={index} {...process} />
          ))}
        </div>
      </div>

      {/* Thickness Guide */}
      <div className="container mx-auto px-4 py-12 bg-muted/30">
        <h2 className="text-3xl font-bold text-center mb-8">Material Thickness Guide</h2>
        <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {thicknessGuide.map((guide, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="font-bold text-lg text-primary mb-2">{guide.thickness}</div>
                <div className="text-muted-foreground">{guide.uses}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Materials Grid */}
      <MaterialsGrid materials={materials} title="Available Materials" />

      {/* Advantages & Limitations */}
      <AdvantagesComparison advantages={advantages} limitations={limitations} />

      {/* Applications */}
      <ApplicationsShowcase applications={applications} />

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Fabricate Your Parts?</h2>
          <p className="text-xl mb-8 opacity-90">
            From single prototypes to production runs - we've got you covered
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" variant="secondary">
              Upload Drawing
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              Discuss Your Project
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

export default SheetMetalFabrication;
