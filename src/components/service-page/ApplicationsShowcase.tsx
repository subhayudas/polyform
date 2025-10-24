import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Application {
  industry: string;
  examples: string[];
  icon?: string;
}

interface ApplicationsShowcaseProps {
  applications: Application[];
  title?: string;
}

const ApplicationsShowcase = ({ applications, title = "Real-World Applications" }: ApplicationsShowcaseProps) => {
  return (
    <div className="container mx-auto px-4 py-12 bg-muted/30">
      <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {applications.map((app, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                {app.icon && <span className="text-2xl">{app.icon}</span>}
                {app.industry}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {app.examples.map((example, idx) => (
                  <Badge key={idx} variant="outline" className="mr-2 mb-2">
                    {example}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ApplicationsShowcase;
