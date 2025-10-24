import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface DefinitionSectionProps {
  title: string;
  type: string;
  description: string;
  benefits: string[];
  icon?: LucideIcon;
}

const DefinitionSection = ({ title, type, description, benefits, icon: Icon }: DefinitionSectionProps) => {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardHeader>
          <div className="flex items-start gap-4">
            {Icon && (
              <div className="p-3 rounded-lg bg-primary/10">
                <Icon className="w-8 h-8 text-primary" />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <CardTitle className="text-3xl">{title}</CardTitle>
                <Badge variant="secondary" className="text-sm">{type}</Badge>
              </div>
              <CardDescription className="text-base">{description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground mb-3">Key Benefits:</h4>
            <ul className="grid md:grid-cols-2 gap-2">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span className="text-muted-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DefinitionSection;
