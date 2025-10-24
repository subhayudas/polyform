import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface AdvantagesComparisonProps {
  advantages: string[];
  limitations: string[];
}

const AdvantagesComparison = ({ advantages, limitations }: AdvantagesComparisonProps) => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-8">Advantages & Limitations</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <CheckCircle2 className="w-6 h-6" />
              Advantages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {advantages.map((advantage, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{advantage}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-muted bg-muted/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-muted-foreground">
              <AlertCircle className="w-6 h-6" />
              Considerations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {limitations.map((limitation, index) => (
                <li key={index} className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{limitation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdvantagesComparison;
