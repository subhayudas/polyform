import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface TechniqueCardProps {
  title: string;
  description: string;
  features?: string[];
  image?: string;
  capabilities?: string[];
}

const TechniqueCard = ({ title, description, features, image, capabilities }: TechniqueCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
      {image && (
        <div className="overflow-hidden">
          <AspectRatio ratio={16 / 9}>
            <img 
              src={image} 
              alt={title}
              className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
            />
          </AspectRatio>
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {features && features.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2 text-foreground">Key Features:</h4>
            <ul className="space-y-1">
              {features.map((feature, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {capabilities && capabilities.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2 text-foreground">Capabilities:</h4>
            <div className="flex flex-wrap gap-2">
              {capabilities.map((capability, index) => (
                <Badge key={index} variant="secondary">
                  {capability}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        <Button className="w-full mt-4">Request Quote</Button>
      </CardContent>
    </Card>
  );
};

export default TechniqueCard;
