
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import FileDropZone from './FileDropZone';
import FileSelector from './FileSelector';
import SuccessMessage from './SuccessMessage';
import InstantPricing from './InstantPricing';
import FileUploadForm from './FileUploadForm';
import SimpleFileUploadForm from './SimpleFileUploadForm';
import DirectOrderSubmission from './DirectOrderSubmission';

const FileUploadWithPricing = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [material, setMaterial] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [pricing, setPricing] = useState<any>(null);
  const { toast } = useToast();

  const allowedTypes = ['.pdf', '.doc', '.docx', '.stl', '.obj', '.3mf', '.step', '.stp', '.iges', '.igs'];
  const allowedMimeTypes = [
    'application/pdf', 
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'model/stl',
    'application/sla'
  ];

  const validateFile = (file: File): boolean => {
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const isValidType = allowedTypes.includes(fileExtension) || allowedMimeTypes.includes(file.type);
    
    if (!isValidType) {
      toast({
        title: "Invalid file type",
        description: "Please upload 3D model files (STL, OBJ, 3MF, STEP, IGES) or documents (PDF, DOC, DOCX).",
        variant: "destructive",
      });
      return false;
    }

    const maxSize = fileExtension.includes('.stl') || fileExtension.includes('.obj') || fileExtension.includes('.3mf') || fileExtension.includes('.step') || fileExtension.includes('.iges')
      ? 100 * 1024 * 1024 
      : 10 * 1024 * 1024;
    
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: `Please upload files smaller than ${maxSize / (1024 * 1024)}MB.`,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const file = event.dataTransfer.files[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleContinue = () => {
    if (!material) {
      toast({
        title: "Material Required",
        description: "Please select a material to continue.",
        variant: "destructive",
      });
      return;
    }
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setIsComplete(true);
    setShowForm(false);
    setSelectedFile(null);
    setMaterial('');
    setQuantity(1);
    setPricing(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setShowForm(false);
    setMaterial('');
    setPricing(null);
  };

  const startOver = () => {
    setIsComplete(false);
    setSelectedFile(null);
    setShowForm(false);
    setMaterial('');
    setQuantity(1);
    setPricing(null);
  };

  const handleViewDashboard = () => {
    window.location.href = '/dashboard';
  };

  if (isComplete) {
    return (
      <SuccessMessage
        onStartOver={startOver}
        onViewDashboard={handleViewDashboard}
      />
    );
  }

  if (showForm && selectedFile && material && pricing) {
    return (
      <DirectOrderSubmission
        file={selectedFile}
        material={material}
        quantity={quantity}
        pricing={pricing}
        onSuccess={handleFormSuccess}
        onCancel={handleFormCancel}
      />
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Upload Your Files & Get Instant Pricing</CardTitle>
          <CardDescription className="text-center">
            Upload your 3D model files and get an instant quote with real-time pricing.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FileDropZone
            selectedFile={selectedFile}
            isDragOver={isDragOver}
            onFileSelect={handleFileSelect}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onRemoveFile={removeFile}
          />

          {selectedFile && (
            <FileSelector
              material={material}
              quantity={quantity}
              onMaterialChange={setMaterial}
              onQuantityChange={setQuantity}
            />
          )}
        </CardContent>
      </Card>

      {selectedFile && material && (
        <InstantPricing
          file={selectedFile}
          selectedMaterial={material}
          quantity={quantity}
          onPricingUpdate={setPricing}
        />
      )}

      {selectedFile && material && pricing && (
        <div className="flex justify-center">
          <Button
            onClick={handleContinue}
            className="bg-polyform-green-600 hover:bg-polyform-green-700 text-white px-8 py-3"
            size="lg"
          >
            Continue with This Quote - ${pricing.total.toFixed(2)}
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUploadWithPricing;
