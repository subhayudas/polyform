import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Material {
  name: string;
  properties?: string[];
  grades?: string[];
  description?: string;
}

interface MaterialsGridProps {
  materials: Material[];
  title?: string;
}

const MaterialsGrid = ({ materials, title = "Available Materials" }: MaterialsGridProps) => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materials.map((material, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-300 group">
            <CardHeader>
              <CardTitle className="text-xl group-hover:text-primary transition-colors">
                {material.name}
              </CardTitle>
              {material.description && (
                <p className="text-sm text-muted-foreground mt-2">{material.description}</p>
              )}
            </CardHeader>
            <CardContent>
              {material.properties && material.properties.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">Properties:</p>
                  <div className="flex flex-wrap gap-2">
                    {material.properties.map((prop, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {prop}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {material.grades && material.grades.length > 0 && (
                <div className="space-y-2 mt-3">
                  <p className="text-sm font-semibold text-foreground">Grades:</p>
                  <div className="flex flex-wrap gap-2">
                    {material.grades.map((grade, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {grade}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MaterialsGrid;
