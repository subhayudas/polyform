
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ComingSoon from './ComingSoon';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import FileUploadWithPricing from '@/components/FileUploadWithPricing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Layers3, Settings, Factory, Wrench, Upload, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Quote = () => {
  const { user, isLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeService, setActiveService] = useState('3d-printing');

  useEffect(() => {
    const service = searchParams.get('service');
    if (service) {
      setActiveService(service);
    }
  }, [searchParams]);

  // Show coming soon page for authenticated users in pre-launch
  if (user && !isLoading) {
    return <ComingSoon />;
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-polyform-green-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Get Your Quote
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Upload your files and get instant quotes for all our manufacturing services.
              Choose your service below to get started.
            </p>
          </div>
        </div>
      </section>

      {/* Quote Form Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeService} onValueChange={setActiveService} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="3d-printing" className="flex items-center space-x-2">
                <Layers3 className="w-4 h-4" />
                <span>3D Printing</span>
              </TabsTrigger>
              <TabsTrigger value="cnc-machining" className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>CNC Machining</span>
              </TabsTrigger>
              <TabsTrigger value="sheet-metal" className="flex items-center space-x-2">
                <Factory className="w-4 h-4" />
                <span>Sheet Metal</span>
              </TabsTrigger>
              <TabsTrigger value="prototyping" className="flex items-center space-x-2">
                <Wrench className="w-4 h-4" />
                <span>Prototyping</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="3d-printing">
              <FileUploadWithPricing />
            </TabsContent>
            
            <TabsContent value="cnc-machining">
              <CNCMachiningForm />
            </TabsContent>
            
            <TabsContent value="sheet-metal">
              <SheetMetalForm />
            </TabsContent>
            
            <TabsContent value="prototyping">
              <PrototypingForm />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <WhatsAppButton variant="fixed" />
      <Footer />
    </div>
  );
};

// Enhanced 3D Printing Form
const ThreeDPrintingForm = () => {
  const [technology, setTechnology] = useState('SLA(Resin)');
  const [material, setMaterial] = useState('9600 Resin');
  const [color, setColor] = useState('Matte White');
  const [surfaceFinish, setSurfaceFinish] = useState('Yes');
  const [sandingType, setSandingType] = useState('General Sanding');
  const [quantity, setQuantity] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      toast({
        title: "Files uploaded!",
        description: `${files.length} file(s) selected successfully.`,
      });
    }
  };

  const handleDelete = () => {
    setTechnology('SLA(Resin)');
    setMaterial('9600 Resin');
    setColor('Matte White');
    setSurfaceFinish('Yes');
    setSandingType('General Sanding');
    setQuantity(1);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast({
      title: "Form cleared",
      description: "All form fields have been reset.",
    });
  };

  const handleAddToCart = () => {
    toast({
      title: "Added to cart!",
      description: "Your quote has been added to the cart.",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - File Upload */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="w-5 h-5" />
              <span>Upload Files</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-polyform-green-300 rounded-lg p-6 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-600 mb-2">Add 3D Files</p>
              <p className="text-xs text-gray-500 mb-4">
                Wall thickness≥1.2mm, thinnest part≥0.8mm, hole size≥1.5mm. 
                Supported files: STL, STP, and more...
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".stl,.stp,.step,.obj"
                className="hidden"
                onChange={handleFileChange}
              />
              <Button 
                className="bg-polyform-green-600 hover:bg-polyform-green-700 text-white"
                onClick={handleFileUpload}
                type="button"
              >
                Add 3D Files
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              All uploads are secure and confidential
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Configuration */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>3D Printing Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 3D Technology */}
            <div className="space-y-3">
              <Label className="text-base font-medium">3D Technology</Label>
              <div className="flex flex-wrap gap-2">
                {['SLA(Resin)', 'MJF(Nylon)', 'SLM(Metal)', 'FDM(Plastic)', 'SLS(Nylon)', 'WJP(Resin)', 'BJ(Metal)'].map((tech) => (
                  <Button
                    key={tech}
                    variant={technology === tech ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTechnology(tech)}
                    className={technology === tech ? "bg-polyform-green-600 hover:bg-polyform-green-700" : ""}
                  >
                    {tech}
                  </Button>
                ))}
              </div>
            </div>

            {/* Material */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Material</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {['9600 Resin', 'Black Resin', 'Imagine Black', '8228 Resin', 'LEDO 6060 Resin', '8001 Resin', 'CBY Resin', 'X Resin', 'JLC Black Resin', 'Grey Resin'].map((mat) => (
                  <Button
                    key={mat}
                    variant={material === mat ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMaterial(mat)}
                    className={`text-xs ${material === mat ? "bg-polyform-green-600 hover:bg-polyform-green-700" : ""}`}
                  >
                    {mat}
                  </Button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Color</Label>
              <div className="flex gap-2">
                <Button
                  variant={color === 'Matte White' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setColor('Matte White')}
                  className={color === 'Matte White' ? "bg-polyform-green-600 hover:bg-polyform-green-700" : ""}
                >
                  Matte White
                </Button>
              </div>
            </div>

            {/* Surface Finish */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Surface Finish</Label>
              <RadioGroup value={surfaceFinish} onValueChange={setSurfaceFinish} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Yes" id="finish-yes" />
                  <Label htmlFor="finish-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id="finish-no" />
                  <Label htmlFor="finish-no">No</Label>
                </div>
              </RadioGroup>

              {surfaceFinish === 'Yes' && (
                <div className="mt-4 space-y-3">
                  <Select value={sandingType} onValueChange={setSandingType}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="General Sanding">General Sanding</SelectItem>
                      <SelectItem value="Fine Sanding">Fine Sanding</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center space-x-2 text-polyform-green-600 cursor-pointer">
                    <span className="text-sm">+ Add</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quantity */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Qty</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-20"
                  min="1"
                />
                <div className="flex">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>

            {/* Product Description */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Product Desc</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="prototype">Prototype</SelectItem>
                  <SelectItem value="production">Production</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price Display */}
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Price</span>
                <span className="text-2xl font-bold text-orange-500">$8.90</span>
              </div>
            </div>

            {/* 3D Remark */}
            <div className="space-y-3">
              <Label className="text-base font-medium">3D Remark</Label>
              <textarea
                className="w-full p-3 border rounded-md resize-none"
                rows={3}
                placeholder="Add any special instructions..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleDelete}
                type="button"
              >
                Delete
              </Button>
              <Button 
                className="flex-1 bg-polyform-green-600 hover:bg-polyform-green-700"
                onClick={handleAddToCart}
                type="button"
              >
                Add to Cart
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Enhanced CNC Machining Form
const CNCMachiningForm = () => {
  const [material, setMaterial] = useState('Aluminum');
  const [materialType, setMaterialType] = useState('Aluminum 6061');
  const [surfaceFinish, setSurfaceFinish] = useState('Yes');
  const [finishType, setFinishType] = useState('Bead blasting + Anodizing');
  const [finishColor, setFinishColor] = useState('Natural');
  const [tolerance, setTolerance] = useState('ISO 2768 medium');
  const [roughness, setRoughness] = useState('Ra3.2');
  const [threads, setThreads] = useState('No');
  const [subAssembly, setSubAssembly] = useState('No');
  const [quantity, setQuantity] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      toast({
        title: "Files uploaded!",
        description: `${files.length} file(s) selected successfully.`,
      });
    }
  };

  const handleDelete = () => {
    setMaterial('Aluminum');
    setMaterialType('Aluminum 6061');
    setSurfaceFinish('Yes');
    setFinishType('Bead blasting + Anodizing');
    setFinishColor('Natural');
    setTolerance('ISO 2768 medium');
    setRoughness('Ra3.2');
    setThreads('No');
    setSubAssembly('No');
    setQuantity(1);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast({
      title: "Form cleared",
      description: "All form fields have been reset.",
    });
  };

  const handleRequestQuote = () => {
    toast({
      title: "Quote requested!",
      description: "We'll process your quote and get back to you shortly.",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - File Upload */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="w-5 h-5" />
              <span>Upload Files</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-polyform-green-300 rounded-lg p-6 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-600 mb-2">Upload 3D models</p>
              <p className="text-xs text-gray-500 mb-4">
                File types: STEP,STP,DWG,DXF,PDF,Zip,Rar. File size: &lt; 100MB.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".step,.stp,.dwg,.dxf,.pdf,.zip,.rar"
                className="hidden"
                onChange={handleFileChange}
              />
              <Button 
                className="bg-polyform-green-600 hover:bg-polyform-green-700 text-white"
                onClick={handleFileUpload}
                type="button"
              >
                Upload 3D models
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              All uploads are secure and confidential
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Configuration */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>CNC Machining Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Quantity */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Qty</Label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-20"
                min="1"
                max="100"
              />
            </div>

            {/* Material */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Material</Label>
              <div className="flex flex-wrap gap-2">
                {['Aluminum', 'Plastic', 'Copper Alloy', 'Steel Alloy', 'Stainless Steel'].map((mat) => (
                  <Button
                    key={mat}
                    variant={material === mat ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMaterial(mat)}
                    className={material === mat ? "bg-polyform-green-600 hover:bg-polyform-green-700" : ""}
                  >
                    {mat}
                  </Button>
                ))}
              </div>
            </div>

            {/* Type of Material */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Type of Aluminum</Label>
              <div className="flex items-center gap-2">
                <Select value={materialType} onValueChange={setMaterialType}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aluminum 6061">Aluminum 6061</SelectItem>
                    <SelectItem value="Aluminum 7075">Aluminum 7075</SelectItem>
                    <SelectItem value="Aluminum 2024">Aluminum 2024</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="link" className="text-polyform-green-600 text-sm">
                  View our materials
                </Button>
              </div>
            </div>

            {/* Surface Finish */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Surface Finish</Label>
              <RadioGroup value={surfaceFinish} onValueChange={setSurfaceFinish} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Yes" id="cnc-finish-yes" />
                  <Label htmlFor="cnc-finish-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id="cnc-finish-no" />
                  <Label htmlFor="cnc-finish-no">No</Label>
                </div>
              </RadioGroup>

              {surfaceFinish === 'Yes' && (
                <div className="space-y-4">
                  <Select value={finishType} onValueChange={setFinishType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bead blasting + Anodizing">Bead blasting + Anodizing</SelectItem>
                      <SelectItem value="Anodizing">Anodizing</SelectItem>
                      <SelectItem value="Powder Coating">Powder Coating</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex gap-2">
                    <Button
                      variant={finishColor === 'Natural' ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFinishColor('Natural')}
                      className={finishColor === 'Natural' ? "bg-polyform-green-600 hover:bg-polyform-green-700" : ""}
                    >
                      Natural
                    </Button>
                    <Button
                      variant={finishColor === 'Matte' ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFinishColor('Matte')}
                      className={finishColor === 'Matte' ? "bg-polyform-green-600 hover:bg-polyform-green-700" : ""}
                    >
                      Matte
                    </Button>
                    <Button
                      variant={finishColor === 'Glossy' ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFinishColor('Glossy')}
                      className={finishColor === 'Glossy' ? "bg-polyform-green-600 hover:bg-polyform-green-700" : ""}
                    >
                      Glossy
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2 text-polyform-green-600 cursor-pointer">
                    <span className="text-sm">+ Add finish</span>
                  </div>
                </div>
              )}
              
              <Button variant="link" className="text-polyform-green-600 text-sm p-0">
                View our finishes
              </Button>
            </div>

            {/* Tightest Tolerance */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Tightest Tolerance</Label>
              <div className="flex gap-2">
                <Button
                  variant={tolerance === 'ISO 2768 medium' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTolerance('ISO 2768 medium')}
                  className={tolerance === 'ISO 2768 medium' ? "bg-polyform-green-600 hover:bg-polyform-green-700" : ""}
                >
                  ISO 2768 medium
                </Button>
                <Button
                  variant={tolerance === '±0.10mm' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTolerance('±0.10mm')}
                  className={tolerance === '±0.10mm' ? "bg-polyform-green-600 hover:bg-polyform-green-700" : ""}
                >
                  ±0.10mm
                </Button>
                <Button
                  variant={tolerance === '±0.05mm' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTolerance('±0.05mm')}
                  className={tolerance === '±0.05mm' ? "bg-polyform-green-600 hover:bg-polyform-green-700" : ""}
                >
                  ±0.05mm
                </Button>
              </div>
            </div>

            {/* Smallest Roughness */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Smallest Roughness</Label>
              <div className="flex gap-2">
                <Button
                  variant={roughness === 'Ra3.2' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setRoughness('Ra3.2')}
                  className={roughness === 'Ra3.2' ? "bg-polyform-green-600 hover:bg-polyform-green-700" : ""}
                >
                  Ra3.2
                </Button>
                <Button
                  variant={roughness === 'Ra1.6' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setRoughness('Ra1.6')}
                  className={roughness === 'Ra1.6' ? "bg-polyform-green-600 hover:bg-polyform-green-700" : ""}
                >
                  Ra1.6
                </Button>
              </div>
            </div>

            {/* Threads */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Threads</Label>
              <RadioGroup value={threads} onValueChange={setThreads} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id="threads-no" />
                  <Label htmlFor="threads-no">No</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Yes" id="threads-yes" />
                  <Label htmlFor="threads-yes">Yes</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Sub-assembly */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Sub-assembly</Label>
              <RadioGroup value={subAssembly} onValueChange={setSubAssembly} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id="assembly-no" />
                  <Label htmlFor="assembly-no">No</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Yes" id="assembly-yes" />
                  <Label htmlFor="assembly-yes">Yes</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Product Description */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Product Desc</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="prototype">Prototype</SelectItem>
                  <SelectItem value="production">Production</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price Display */}
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Price</span>
                <span className="text-2xl font-bold text-orange-500">Manual Quote</span>
              </div>
            </div>

            {/* CNC Remark */}
            <div className="space-y-3">
              <Label className="text-base font-medium">CNC Remark</Label>
              <textarea
                className="w-full p-3 border rounded-md resize-none"
                rows={3}
                placeholder="Add any special instructions..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleDelete}
                type="button"
              >
                Delete
              </Button>
              <Button 
                className="flex-1 bg-polyform-green-600 hover:bg-polyform-green-700"
                onClick={handleRequestQuote}
                type="button"
              >
                Request a Quote
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Enhanced Sheet Metal Form
const SheetMetalForm = () => {
  const [material, setMaterial] = useState('Mild Steel');
  const [materialType, setMaterialType] = useState('SPCC');
  const [thickness, setThickness] = useState('1.0mm');
  const [processes, setProcesses] = useState(['Laser Cutting']);
  const [surfaceFinish, setSurfaceFinish] = useState('Yes');
  const [finishType, setFinishType] = useState('Powder Coating');
  const [finishColor, setFinishColor] = useState('Black');
  const [tolerance, setTolerance] = useState('±0.10mm');
  const [quantity, setQuantity] = useState(1);
  const [bending, setBending] = useState('No');
  const [threading, setThreading] = useState('No');
  const [assembly, setAssembly] = useState('No');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleProcess = (process: string) => {
    setProcesses(prev => 
      prev.includes(process) 
        ? prev.filter(p => p !== process)
        : [...prev, process]
    );
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      toast({
        title: "Files uploaded!",
        description: `${files.length} file(s) selected successfully.`,
      });
    }
  };

  const handleDelete = () => {
    setMaterial('Mild Steel');
    setMaterialType('SPCC');
    setThickness('1.0mm');
    setProcesses(['Laser Cutting']);
    setSurfaceFinish('Yes');
    setFinishType('Powder Coating');
    setFinishColor('Black');
    setTolerance('±0.10mm');
    setQuantity(1);
    setBending('No');
    setThreading('No');
    setAssembly('No');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast({
      title: "Form cleared",
      description: "All form fields have been reset.",
    });
  };

  const handleRequestQuote = () => {
    toast({
      title: "Quote requested!",
      description: "We'll process your quote and get back to you shortly.",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - File Upload */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="w-5 h-5" />
              <span>Upload Files</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-polyform-green-300 rounded-lg p-6 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-600 mb-2">Upload 2D drawings</p>
              <p className="text-xs text-gray-500 mb-4">
                File types: DWG, DXF, PDF, AI, CDR. File size: &lt; 100MB.
                Min bend radius: 1x thickness. Max bend angle: 135°.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".dwg,.dxf,.pdf,.ai,.cdr"
                className="hidden"
                onChange={handleFileChange}
              />
              <Button 
                className="bg-polyform-green-600 hover:bg-polyform-green-700 text-white"
                onClick={handleFileUpload}
                type="button"
              >
                Upload 2D drawings
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              All uploads are secure and confidential
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Configuration */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Sheet Metal Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Quantity */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Qty</Label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-20"
                min="1"
                max="10000"
              />
            </div>

            {/* Material */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Material</Label>
              <div className="flex flex-wrap gap-2">
                {['Mild Steel', 'Stainless Steel', 'Aluminum', 'Galvanized Steel', 'Copper'].map((mat) => (
                  <Button
                    key={mat}
                    variant={material === mat ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMaterial(mat)}
                    className={material === mat ? "bg-polyform-green-600 hover:bg-polyform-green-700" : ""}
                  >
                    {mat}
                  </Button>
                ))}
              </div>
            </div>

            {/* Material Type */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Type of {material}</Label>
              <div className="flex items-center gap-2">
                <Select value={materialType} onValueChange={setMaterialType}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {material === 'Mild Steel' && (
                      <>
                        <SelectItem value="SPCC">SPCC</SelectItem>
                        <SelectItem value="SPHC">SPHC</SelectItem>
                        <SelectItem value="Q235">Q235</SelectItem>
                      </>
                    )}
                    {material === 'Stainless Steel' && (
                      <>
                        <SelectItem value="SUS304">SUS304</SelectItem>
                        <SelectItem value="SUS316">SUS316</SelectItem>
                        <SelectItem value="SUS430">SUS430</SelectItem>
                      </>
                    )}
                    {material === 'Aluminum' && (
                      <>
                        <SelectItem value="5052">5052</SelectItem>
                        <SelectItem value="6061">6061</SelectItem>
                        <SelectItem value="1060">1060</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
                <Button variant="link" className="text-polyform-green-600 text-sm">
                  View materials
                </Button>
              </div>
            </div>

            {/* Thickness */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Thickness</Label>
              <div className="flex flex-wrap gap-2">
                {['0.5mm', '0.8mm', '1.0mm', '1.2mm', '1.5mm', '2.0mm', '2.5mm', '3.0mm'].map((thick) => (
                  <Button
                    key={thick}
                    variant={thickness === thick ? "default" : "outline"}
                    size="sm"
                    onClick={() => setThickness(thick)}
                    className={thickness === thick ? "bg-polyform-green-600 hover:bg-polyform-green-700" : ""}
                  >
                    {thick}
                  </Button>
                ))}
              </div>
            </div>

            {/* Processes */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Processes</Label>
              <div className="flex flex-wrap gap-2">
                {['Laser Cutting', 'Punching', 'Bending', 'Welding', 'Tapping', 'Countersinking'].map((proc) => (
                  <Button
                    key={proc}
                    variant={processes.includes(proc) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleProcess(proc)}
                    className={processes.includes(proc) ? "bg-polyform-green-600 hover:bg-polyform-green-700" : ""}
                  >
                    {proc}
                  </Button>
                ))}
              </div>
            </div>

            {/* Bending */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Bending</Label>
              <RadioGroup value={bending} onValueChange={setBending} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id="bend-no" />
                  <Label htmlFor="bend-no">No</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Yes" id="bend-yes" />
                  <Label htmlFor="bend-yes">Yes</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Threading */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Threading</Label>
              <RadioGroup value={threading} onValueChange={setThreading} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id="thread-no" />
                  <Label htmlFor="thread-no">No</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Yes" id="thread-yes" />
                  <Label htmlFor="thread-yes">Yes</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Surface Finish */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Surface Finish</Label>
              <RadioGroup value={surfaceFinish} onValueChange={setSurfaceFinish} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Yes" id="sm-finish-yes" />
                  <Label htmlFor="sm-finish-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id="sm-finish-no" />
                  <Label htmlFor="sm-finish-no">No</Label>
                </div>
              </RadioGroup>

              {surfaceFinish === 'Yes' && (
                <div className="space-y-4">
                  <Select value={finishType} onValueChange={setFinishType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Powder Coating">Powder Coating</SelectItem>
                      <SelectItem value="Galvanizing">Galvanizing</SelectItem>
                      <SelectItem value="Anodizing">Anodizing</SelectItem>
                      <SelectItem value="Brushing">Brushing</SelectItem>
                      <SelectItem value="Plating">Plating</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex gap-2">
                    {['Black', 'White', 'Gray', 'Blue', 'Red', 'Natural'].map((color) => (
                      <Button
                        key={color}
                        variant={finishColor === color ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFinishColor(color)}
                        className={finishColor === color ? "bg-polyform-green-600 hover:bg-polyform-green-700" : ""}
                      >
                        {color}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Tolerance */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Tolerance</Label>
              <div className="flex gap-2">
                {['±0.10mm', '±0.05mm', '±0.02mm'].map((tol) => (
                  <Button
                    key={tol}
                    variant={tolerance === tol ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTolerance(tol)}
                    className={tolerance === tol ? "bg-polyform-green-600 hover:bg-polyform-green-700" : ""}
                  >
                    {tol}
                  </Button>
                ))}
              </div>
            </div>

            {/* Assembly */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Assembly</Label>
              <RadioGroup value={assembly} onValueChange={setAssembly} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id="sm-assembly-no" />
                  <Label htmlFor="sm-assembly-no">No</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Yes" id="sm-assembly-yes" />
                  <Label htmlFor="sm-assembly-yes">Yes</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Product Description */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Product Desc</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="prototype">Prototype</SelectItem>
                  <SelectItem value="production">Production</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price Display */}
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Price</span>
                <span className="text-2xl font-bold text-orange-500">Manual Quote</span>
              </div>
            </div>

            {/* Sheet Metal Remark */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Sheet Metal Remark</Label>
              <textarea
                className="w-full p-3 border rounded-md resize-none"
                rows={3}
                placeholder="Add any special instructions..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleDelete}
                type="button"
              >
                Delete
              </Button>
              <Button 
                className="flex-1 bg-polyform-green-600 hover:bg-polyform-green-700"
                onClick={handleRequestQuote}
                type="button"
              >
                Request a Quote
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Enhanced Prototyping Form
const PrototypingForm = () => {
  const [prototypeType, setPrototypeType] = useState('Rapid Prototyping');
  const [technology, setTechnology] = useState('3D Printing');
  const [material, setMaterial] = useState('PLA');
  const [finishing, setFinishing] = useState('Standard');
  const [postProcessing, setPostProcessing] = useState(['Sanding']);
  const [tolerance, setTolerance] = useState('±0.1mm');
  const [quantity, setQuantity] = useState(1);
  const [urgency, setUrgency] = useState('Standard');
  const [testing, setTesting] = useState('No');
  const [documentation, setDocumentation] = useState('Basic');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const togglePostProcess = (process: string) => {
    setPostProcessing(prev => 
      prev.includes(process) 
        ? prev.filter(p => p !== process)
        : [...prev, process]
    );
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      toast({
        title: "Files uploaded!",
        description: `${files.length} file(s) selected successfully.`,
      });
    }
  };

  const handleDelete = () => {
    setPrototypeType('Rapid Prototyping');
    setTechnology('3D Printing');
    setMaterial('PLA');
    setFinishing('Standard');
    setPostProcessing(['Sanding']);
    setTolerance('±0.1mm');
    setQuantity(1);
    setUrgency('Standard');
    setTesting('No');
    setDocumentation('Basic');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast({
      title: "Form cleared",
      description: "All form fields have been reset.",
    });
  };

  const handleRequestQuote = () => {
    toast({
      title: "Quote requested!",
      description: "We'll process your quote and get back to you shortly.",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - File Upload */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="w-5 h-5" />
              <span>Upload Files</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-polyform-green-300 rounded-lg p-6 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-600 mb-2">Upload design files</p>
              <p className="text-xs text-gray-500 mb-4">
                File types: STL, STEP, STP, IGES, DWG, PDF, ZIP. File size: &lt; 500MB.
                Include assembly drawings and material specifications.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".stl,.step,.stp,.iges,.dwg,.pdf,.zip"
                className="hidden"
                onChange={handleFileChange}
              />
              <Button 
                className="bg-polyform-green-600 hover:bg-polyform-green-700 text-white"
                onClick={handleFileUpload}
                type="button"
              >
                Upload design files
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              All uploads are secure and confidential
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Configuration */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Prototyping Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Quantity */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Qty</Label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-20"
                min="1"
                max="100"
              />
            </div>

            {/* Prototype Type */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Prototype Type</Label>
              <div className="flex flex-wrap gap-2">
                {['Rapid Prototyping', 'Functional Prototype', 'Visual Prototype', 'Pre-Production'].map((type) => (
                  <Button
                    key={type}
                    variant={prototypeType === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPrototypeType(type)}
                    className={prototypeType === type ? "bg-polyform-green-600 hover:bg-polyform-green-700" : ""}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>

            {/* Technology */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Technology</Label>
              <div className="flex flex-wrap gap-2">
                {['3D Printing', 'CNC Machining', 'Injection Molding', 'Vacuum Casting', 'Sheet Metal'].map((tech) => (
                  <Button
                    key={tech}
                    variant={technology === tech ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTechnology(tech)}
                    className={technology === tech ? "bg-polyform-green-600 hover:bg-polyform-green-700" : ""}
                  >
                    {tech}
                  </Button>
                ))}
              </div>
            </div>

            {/* Material */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Material</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {technology === '3D Printing' && ['PLA', 'ABS', 'PETG', 'Resin', 'Nylon', 'TPU'].map((mat) => (
                  <Button
                    key={mat}
                    variant={material === mat ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMaterial(mat)}
                    className={`text-xs ${material === mat ? "bg-polyform-green-600 hover:bg-polyform-green-700" : ""}`}
                  >
                    {mat}
                  </Button>
                ))}
                {technology === 'CNC Machining' && ['Aluminum', 'Steel', 'Stainless Steel', 'Brass', 'Plastic', 'Titanium'].map((mat) => (
                  <Button
                    key={mat}
                    variant={material === mat ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMaterial(mat)}
                    className={`text-xs ${material === mat ? "bg-polyform-green-600 hover:bg-polyform-green-700" : ""}`}
                  >
                    {mat}
                  </Button>
                ))}
              </div>
            </div>

            {/* Finishing */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Surface Finishing</Label>
              <div className="flex gap-2">
                {['Standard', 'Smooth', 'Textured', 'Painted', 'Plated'].map((finish) => (
                  <Button
                    key={finish}
                    variant={finishing === finish ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFinishing(finish)}
                    className={finishing === finish ? "bg-polyform-green-600 hover:bg-polyform-green-700" : ""}
                  >
                    {finish}
                  </Button>
                ))}
              </div>
            </div>

            {/* Post Processing */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Post Processing</Label>
              <div className="flex flex-wrap gap-2">
                {['Sanding', 'Painting', 'Assembly', 'Testing', 'Inspection', 'Packaging'].map((proc) => (
                  <Button
                    key={proc}
                    variant={postProcessing.includes(proc) ? "default" : "outline"}
                    size="sm"
                    onClick={() => togglePostProcess(proc)}
                    className={postProcessing.includes(proc) ? "bg-polyform-green-600 hover:bg-polyform-green-700" : ""}
                  >
                    {proc}
                  </Button>
                ))}
              </div>
            </div>

            {/* Tolerance */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Tolerance</Label>
              <div className="flex gap-2">
                {['±0.1mm', '±0.05mm', '±0.02mm', '±0.01mm'].map((tol) => (
                  <Button
                    key={tol}
                    variant={tolerance === tol ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTolerance(tol)}
                    className={tolerance === tol ? "bg-polyform-green-600 hover:bg-polyform-green-700" : ""}
                  >
                    {tol}
                  </Button>
                ))}
              </div>
            </div>

            {/* Urgency */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Delivery Urgency</Label>
              <div className="flex gap-2">
                {['Standard (7-10 days)', 'Rush (3-5 days)', 'Express (1-2 days)'].map((urg) => (
                  <Button
                    key={urg}
                    variant={urgency === urg ? "default" : "outline"}
                    size="sm"
                    onClick={() => setUrgency(urg)}
                    className={urgency === urg ? "bg-polyform-green-600 hover:bg-polyform-green-700" : ""}
                  >
                    {urg}
                  </Button>
                ))}
              </div>
            </div>

            {/* Testing */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Functional Testing</Label>
              <RadioGroup value={testing} onValueChange={setTesting} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id="test-no" />
                  <Label htmlFor="test-no">No</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Yes" id="test-yes" />
                  <Label htmlFor="test-yes">Yes</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Documentation */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Documentation</Label>
              <Select value={documentation} onValueChange={setDocumentation}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Basic">Basic Report</SelectItem>
                  <SelectItem value="Detailed">Detailed Analysis</SelectItem>
                  <SelectItem value="Full">Full Documentation Package</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Product Description */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Product Desc</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="concept">Concept Validation</SelectItem>
                  <SelectItem value="functional">Functional Testing</SelectItem>
                  <SelectItem value="market">Market Testing</SelectItem>
                  <SelectItem value="pre-production">Pre-Production</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price Display */}
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Price</span>
                <span className="text-2xl font-bold text-orange-500">Manual Quote</span>
              </div>
            </div>

            {/* Prototyping Remark */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Prototyping Remark</Label>
              <textarea
                className="w-full p-3 border rounded-md resize-none"
                rows={3}
                placeholder="Describe your project requirements, timeline, and any special considerations..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleDelete}
                type="button"
              >
                Delete
              </Button>
              <Button 
                className="flex-1 bg-polyform-green-600 hover:bg-polyform-green-700"
                onClick={handleRequestQuote}
                type="button"
              >
                Request a Quote
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Quote;
