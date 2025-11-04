import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Upload, X, File, AlertCircle, CheckCircle2, Info, Calculator, Clock, Truck } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { calculatePriceRange, PricingOptions } from '@/utils/pricingCalculator';

interface FileItem {
  id: string;
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

interface ManufacturingProcess {
  id: string;
  name: string;
  category: string;
  sub_processes: string[];
}

interface MaterialType {
  id: string;
  name: string;
  category: string;
}

interface MaterialVariant {
  id: string;
  material_type_id: string;
  name: string;
  color_options: string[];
  cost_per_unit: number;
  properties: any;
}

interface SurfaceFinish {
  id: string;
  name: string;
  roughness_value: string;
  description: string;
  cost_multiplier?: number;
}

interface PartMarkingType {
  id: string;
  name: string;
  description: string;
  cost_multiplier?: number;
}

interface InspectionType {
  id: string;
  name: string;
  requires_drawing: boolean;
  has_extra_fee: boolean;
}

const MAX_FILES = 12;
const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200 MB
// Allow all file types

const ComprehensiveUploadForm: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // File upload state
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [technicalDrawing, setTechnicalDrawing] = useState<File | null>(null);
  
  // Configuration state
  const [manufacturingProcesses, setManufacturingProcesses] = useState<ManufacturingProcess[]>([]);
  const [selectedProcess, setSelectedProcess] = useState<string>('');
  const [selectedSubProcess, setSelectedSubProcess] = useState<string>('');
  
  const [materialTypes, setMaterialTypes] = useState<MaterialType[]>([]);
  const [materialVariants, setMaterialVariants] = useState<MaterialVariant[]>([]);
  const [selectedMaterialType, setSelectedMaterialType] = useState<string>('');
  const [selectedMaterialVariant, setSelectedMaterialVariant] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [customMaterial, setCustomMaterial] = useState<string>('');
  
  const [surfaceFinishes, setSurfaceFinishes] = useState<SurfaceFinish[]>([]);
  const [selectedSurfaceFinish, setSelectedSurfaceFinish] = useState<string>('');
  
  const [partMarkingTypes, setPartMarkingTypes] = useState<PartMarkingType[]>([]);
  const [selectedPartMarking, setSelectedPartMarking] = useState<string>('');
  
  const [inspectionTypes, setInspectionTypes] = useState<InspectionType[]>([]);
  const [selectedInspection, setSelectedInspection] = useState<string>('');
  
  // Form fields
  const [quantity, setQuantity] = useState<number>(1);
  const [designUnits, setDesignUnits] = useState<'mm' | 'inch' | 'cm'>('mm');
  const [hasThreads, setHasThreads] = useState<boolean>(false);
  const [threadsDescription, setThreadsDescription] = useState<string>('');
  const [hasInserts, setHasInserts] = useState<boolean>(false);
  const [insertsDescription, setInsertsDescription] = useState<string>('');
  const [toleranceType, setToleranceType] = useState<'standard' | 'tighter'>('standard');
  const [toleranceDescription, setToleranceDescription] = useState<string>('');
  const [surfaceRoughness, setSurfaceRoughness] = useState<string>('');
  const [hasAssembly, setHasAssembly] = useState<boolean>(false);
  const [assemblyType, setAssemblyType] = useState<'no_assembly' | 'assembly_test' | 'ship_in_assembly'>('no_assembly');
  const [finishedAppearance, setFinishedAppearance] = useState<'standard' | 'premium'>('standard');
  const [itarCompliance, setItarCompliance] = useState<boolean>(false);
  const [ndaAcknowledged, setNdaAcknowledged] = useState<boolean>(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Pricing state
  const [pricing, setPricing] = useState<{
    minPrice: number;
    maxPrice: number;
    estimatedPrice: number;
    breakdown: any;
    estimatedTime: number;
    estimatedDelivery: Date;
  } | null>(null);

  // Load data from database
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load manufacturing processes
        const { data: processes } = await supabase
          .from('manufacturing_processes')
          .select('*')
          .eq('is_active', true);
        if (processes) setManufacturingProcesses(processes);

        // Load material types
        const { data: types } = await supabase
          .from('material_types')
          .select('*')
          .eq('is_active', true)
          .order('name');
        if (types) setMaterialTypes(types);

        // Load surface finishes
        const { data: finishes } = await supabase
          .from('surface_finishes')
          .select('*')
          .eq('is_active', true);
        if (finishes) setSurfaceFinishes(finishes);

        // Load part marking types
        const { data: markings } = await supabase
          .from('part_marking_types')
          .select('*')
          .eq('is_active', true);
        if (markings) setPartMarkingTypes(markings);

        // Load inspection types
        const { data: inspections } = await supabase
          .from('inspection_types')
          .select('*')
          .eq('is_active', true);
        if (inspections) setInspectionTypes(inspections);
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: "Error",
          description: "Failed to load configuration data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Load material variants when material type is selected
  useEffect(() => {
    const loadMaterialVariants = async () => {
      if (!selectedMaterialType) {
        setMaterialVariants([]);
        return;
      }

      try {
        const { data: variants } = await supabase
          .from('material_variants')
          .select('*')
          .eq('material_type_id', selectedMaterialType)
          .eq('is_active', true)
          .order('name');
        if (variants) setMaterialVariants(variants);
      } catch (error) {
        console.error('Error loading material variants:', error);
      }
    };

    loadMaterialVariants();
  }, [selectedMaterialType]);

  // Reset color when variant changes
  useEffect(() => {
    if (selectedMaterialVariant) {
      const variant = materialVariants.find(v => v.id === selectedMaterialVariant);
      if (variant && variant.color_options && variant.color_options.length > 0) {
        setSelectedColor(variant.color_options[0]);
      } else {
        setSelectedColor('');
      }
    }
  }, [selectedMaterialVariant, materialVariants]);

  // Calculate pricing when relevant inputs change
  useEffect(() => {
    if (files.length === 0 || !selectedMaterialType) {
      setPricing(null);
      return;
    }

    const calculatePricing = async () => {
      try {
        const fileList = files.map(f => f.file);
        const materialName = customMaterial || 
          materialVariants.find(v => v.id === selectedMaterialVariant)?.name || 
          materialTypes.find(t => t.id === selectedMaterialType)?.name || 
          'PLA';

        // Fetch material variant pricing from database if available
        let materialPricing = null;
        if (selectedMaterialVariant) {
          const variant = materialVariants.find(v => v.id === selectedMaterialVariant);
          if (variant) {
            materialPricing = {
              cost_per_unit: variant.cost_per_unit,
              density: variant.density || 1.0,
              setup_cost: variant.setup_cost,
              name: variant.name,
            };
          }
        }

        // Fetch surface finish pricing from database if available
        let surfaceFinishPricing = null;
        if (selectedSurfaceFinish) {
          const finish = surfaceFinishes.find(f => f.id === selectedSurfaceFinish);
          if (finish) {
            // Get cost_multiplier from database (if available in the finish object)
            // For now, we'll need to fetch it separately or it should be in the finish object
            surfaceFinishPricing = {
              cost_multiplier: finish.cost_multiplier || 1.0,
              name: finish.name,
            };
          }
        }

        // Fetch part marking pricing from database if available
        let partMarkingPricing = null;
        if (selectedPartMarking) {
          const marking = partMarkingTypes.find(m => m.id === selectedPartMarking);
          if (marking) {
            partMarkingPricing = {
              cost_multiplier: marking.cost_multiplier || 1.0,
              name: marking.name,
            };
          }
        }

        // Fetch inspection pricing from database if available
        let inspectionPricing = null;
        if (selectedInspection) {
          const inspection = inspectionTypes.find(i => i.id === selectedInspection);
          if (inspection) {
            inspectionPricing = {
              has_extra_fee: inspection.has_extra_fee,
              name: inspection.name,
            };
          }
        }

        const pricingOptions: PricingOptions = {
          manufacturingProcess: selectedProcess,
          materialType: selectedMaterialType,
          materialVariant: selectedMaterialVariant,
          materialName: materialName,
          quantity,
          surfaceFinish: !!selectedSurfaceFinish,
          surfaceFinishId: selectedSurfaceFinish || undefined,
          tighterTolerance: toleranceType === 'tighter',
          hasThreads,
          hasInserts,
          hasAssembly,
          assemblyType: hasAssembly ? assemblyType : undefined,
          finishedAppearance,
          partMarking: !!selectedPartMarking,
          partMarkingId: selectedPartMarking || undefined,
          inspectionType: !!selectedInspection,
          inspectionId: selectedInspection || undefined,
          itarCompliance,
          // Database pricing data
          materialPricing: materialPricing || undefined,
          surfaceFinishPricing: surfaceFinishPricing || undefined,
          partMarkingPricing: partMarkingPricing || undefined,
          inspectionPricing: inspectionPricing || undefined,
        };

        const calculatedPricing = calculatePriceRange(fileList, pricingOptions);
        setPricing(calculatedPricing);
      } catch (error) {
        console.error('Error calculating pricing:', error);
        setPricing(null);
      }
    };

    calculatePricing();
  }, [
    files,
    selectedMaterialType,
    selectedMaterialVariant,
    customMaterial,
    materialVariants,
    materialTypes,
    quantity,
    selectedSurfaceFinish,
    surfaceFinishes,
    toleranceType,
    hasThreads,
    hasInserts,
    hasAssembly,
    assemblyType,
    finishedAppearance,
    selectedPartMarking,
    partMarkingTypes,
    selectedInspection,
    inspectionTypes,
    itarCompliance,
  ]);

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`;
    }
    
    // Allow all file types - no extension validation
    return null;
  };

  const handleFiles = useCallback((fileList: FileList | File[]) => {
    const newFiles = Array.from(fileList);
    const remainingSlots = MAX_FILES - files.length;
    
    if (newFiles.length > remainingSlots) {
      toast({
        title: "Too many files",
        description: `You can only upload up to ${MAX_FILES} files. ${remainingSlots} slots remaining.`,
        variant: "destructive",
      });
      return;
    }

    const validFiles: FileItem[] = [];
    const errors: string[] = [];

    newFiles.forEach((file) => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push({
          id: `${Date.now()}-${Math.random()}`,
          file,
          status: 'pending',
        });
      }
    });

    if (errors.length > 0) {
      toast({
        title: "Invalid files",
        description: errors.join('; '),
        variant: "destructive",
      });
    }

    if (validFiles.length > 0) {
      setFiles((prev) => [...prev, ...validFiles]);
    }
  }, [files.length, toast]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleTechnicalDrawingSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTechnicalDrawing(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit an order.",
        variant: "destructive",
      });
      return;
    }

    if (files.length === 0) {
      toast({
        title: "No files",
        description: "Please upload at least one design file.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedProcess) {
      toast({
        title: "Manufacturing process required",
        description: "Please select a manufacturing process.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedMaterialType || (!selectedMaterialVariant && !customMaterial)) {
      toast({
        title: "Material required",
        description: "Please select a material or enter a custom material.",
        variant: "destructive",
      });
      return;
    }

    if (!ndaAcknowledged) {
      toast({
        title: "NDA acknowledgment required",
        description: "Please acknowledge the NDA and compliance terms.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload design files
      const uploadedFilePaths: string[] = [];
      for (const fileItem of files) {
        const fileExt = fileItem.file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('order-files')
          .upload(fileName, fileItem.file);

        if (uploadError) throw uploadError;
        uploadedFilePaths.push(fileName);
      }

      // Upload technical drawing if provided
      let technicalDrawingPath: string | null = null;
      if (technicalDrawing) {
        const fileExt = technicalDrawing.name.split('.').pop();
        const fileName = `${user.id}/technical-drawings/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('order-files')
          .upload(fileName, technicalDrawing);

        if (uploadError) throw uploadError;
        technicalDrawingPath = fileName;
      }

      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          file_name: files.map(f => f.file.name).join(', '),
          manufacturing_process_id: selectedProcess,
          sub_process: selectedSubProcess || null,
          quantity,
          design_units: designUnits,
          material_type_id: selectedMaterialType,
          material_variant_id: selectedMaterialVariant || null,
          material: customMaterial || materialVariants.find(v => v.id === selectedMaterialVariant)?.name || materialTypes.find(t => t.id === selectedMaterialType)?.name || '',
          selected_color: selectedColor || null,
          surface_finish_id: selectedSurfaceFinish || null,
          technical_drawing_path: technicalDrawingPath,
          has_threads: hasThreads,
          threads_description: hasThreads ? threadsDescription : null,
          has_inserts: hasInserts,
          inserts_description: hasInserts ? insertsDescription : null,
          tolerance_type: toleranceType,
          tolerance_description: toleranceType === 'tighter' ? toleranceDescription : null,
          surface_roughness: surfaceRoughness || null,
          part_marking_id: selectedPartMarking || null,
          has_assembly: hasAssembly,
          assembly_type: hasAssembly ? assemblyType : null,
          finished_appearance: finishedAppearance,
          inspection_type_id: selectedInspection || null,
          itar_compliance: itarCompliance,
          nda_acknowledged: ndaAcknowledged,
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order file records
      for (let i = 0; i < files.length; i++) {
        await supabase
          .from('order_files')
          .insert({
            order_id: orderData.id,
            file_name: files[i].file.name,
            file_path: uploadedFilePaths[i],
            file_size: files[i].file.size,
            file_type: files[i].file.type,
            file_category: 'model',
            uploaded_by: user.id,
          });
      }

      // Create technical drawing file record if exists
      if (technicalDrawing && technicalDrawingPath) {
        await supabase
          .from('order_files')
          .insert({
            order_id: orderData.id,
            file_name: technicalDrawing.name,
            file_path: technicalDrawingPath,
            file_size: technicalDrawing.size,
            file_type: technicalDrawing.type,
            file_category: 'technical_drawing',
            uploaded_by: user.id,
          });
      }

      toast({
        title: "Order submitted successfully!",
        description: `Order #${orderData.order_number} has been submitted. We'll review it and get back to you soon.`,
      });

      // Reset form
      setFiles([]);
      setTechnicalDrawing(null);
      setSelectedProcess('');
      setSelectedSubProcess('');
      setSelectedMaterialType('');
      setSelectedMaterialVariant('');
      setSelectedColor('');
      setCustomMaterial('');
      setQuantity(1);
      setDesignUnits('mm');
      setHasThreads(false);
      setThreadsDescription('');
      setHasInserts(false);
      setInsertsDescription('');
      setToleranceType('standard');
      setToleranceDescription('');
      setSurfaceRoughness('');
      setHasAssembly(false);
      setAssemblyType('no_assembly');
      setFinishedAppearance('standard');
      setSelectedSurfaceFinish('');
      setSelectedPartMarking('');
      setSelectedInspection('');
      setItarCompliance(false);
      setNdaAcknowledged(false);

    } catch (error) {
      console.error('Error submitting order:', error);
      toast({
        title: "Error",
        description: "Failed to submit order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedProcessData = manufacturingProcesses.find(p => p.id === selectedProcess);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-polyform-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>1. Upload Design and configure parts to get a quote</CardTitle>
          <CardDescription>
            Upload your 3D CAD files and configure your parts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? 'border-polyform-green-400 bg-polyform-green-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-2">
              Drag and drop here or select files
            </p>
            <p className="text-sm text-gray-500 mb-4">
              File size &lt; 200 MB (All file types accepted: STL, OBJ, STEP, STP, IGES, IGS, X_T, SLDPRT, 3MF, PDF, and more)
            </p>
            <p className="text-sm text-gray-500 mb-4">
              You can add up to {MAX_FILES} rows of files. To ensure the efficiency of order review, do NOT upload the compressed ZIP folder.
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('file-input')?.click()}
              disabled={files.length >= MAX_FILES}
            >
              Select Files
            </Button>
            <input
              id="file-input"
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              disabled={files.length >= MAX_FILES}
            />
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-2">
              <Label>Uploaded Files ({files.length}/{MAX_FILES})</Label>
              {files.map((fileItem) => (
                <div
                  key={fileItem.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <File className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">{fileItem.file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(fileItem.file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(fileItem.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Note */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              By default, 1. the recessed corners of the part are made in round corners(fillets), 2. sharp edges and burrs would be removed.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Configuration Section */}
      <Card>
        <CardHeader>
          <CardTitle>2. Configure Your Parts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Manufacturing Process */}
          <div className="space-y-2">
            <Label htmlFor="manufacturing-process">Manufacturing Process *</Label>
            <Select value={selectedProcess} onValueChange={setSelectedProcess}>
              <SelectTrigger id="manufacturing-process">
                <SelectValue placeholder="Select manufacturing process" />
              </SelectTrigger>
              <SelectContent>
                {manufacturingProcesses.map((process) => (
                  <SelectItem key={process.id} value={process.id}>
                    {process.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sub Process */}
          {selectedProcessData && selectedProcessData.sub_processes.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="sub-process">Sub Process</Label>
              <Select value={selectedSubProcess} onValueChange={setSelectedSubProcess}>
                <SelectTrigger id="sub-process">
                  <SelectValue placeholder="Select sub process" />
                </SelectTrigger>
                <SelectContent>
                  {selectedProcessData.sub_processes.map((subProcess, index) => (
                    <SelectItem key={index} value={subProcess}>
                      {subProcess}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Quantity and Design Units */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="design-units">Design Units *</Label>
              <Select value={designUnits} onValueChange={(v: 'mm' | 'inch' | 'cm') => setDesignUnits(v)}>
                <SelectTrigger id="design-units">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mm">mm</SelectItem>
                  <SelectItem value="inch">inch</SelectItem>
                  <SelectItem value="cm">cm</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Material Selection */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="material-type">Material *</Label>
              <Select value={selectedMaterialType} onValueChange={setSelectedMaterialType}>
                <SelectTrigger id="material-type">
                  <SelectValue placeholder="Select material" />
                </SelectTrigger>
                <SelectContent>
                  {materialTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Material Variant */}
            {selectedMaterialType && materialVariants.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="material-variant">Type of {materialTypes.find(t => t.id === selectedMaterialType)?.name}</Label>
                <Select value={selectedMaterialVariant} onValueChange={setSelectedMaterialVariant}>
                  <SelectTrigger id="material-variant">
                    <SelectValue placeholder="Select material variant" />
                  </SelectTrigger>
                  <SelectContent>
                    {materialVariants.map((variant) => (
                      <SelectItem key={variant.id} value={variant.id}>
                        {variant.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Custom Material Input */}
            <div className="space-y-2">
              <Label htmlFor="custom-material">Or enter custom material</Label>
              <Input
                id="custom-material"
                placeholder="Please enter custom materials"
                value={customMaterial}
                onChange={(e) => {
                  setCustomMaterial(e.target.value);
                  if (e.target.value) {
                    setSelectedMaterialVariant('');
                  }
                }}
              />
            </div>

            {/* Color Selection */}
            {selectedMaterialVariant && (
              <div className="space-y-2">
                <Label>Color</Label>
                <Select value={selectedColor} onValueChange={setSelectedColor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    {materialVariants
                      .find(v => v.id === selectedMaterialVariant)
                      ?.color_options?.map((color) => (
                        <SelectItem key={color} value={color}>
                          {color}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Surface Finish */}
          <div className="space-y-2">
            <Label htmlFor="surface-finish">Surface Finish</Label>
            <Select value={selectedSurfaceFinish} onValueChange={setSelectedSurfaceFinish}>
              <SelectTrigger id="surface-finish">
                <SelectValue placeholder="Select surface finish" />
              </SelectTrigger>
              <SelectContent>
                {surfaceFinishes.map((finish) => (
                  <SelectItem key={finish.id} value={finish.id}>
                    {finish.name} - {finish.roughness_value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Technical Drawing */}
          <div className="space-y-2">
            <Label>Technical Drawing</Label>
            <p className="text-sm text-gray-500 mb-2">
              Please note that your 3D file and part specifications selected on this screen (eg. surface finish) will take priority over your technical drawing. Please ensure your technical drawing is up-to-date.
            </p>
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept=".pdf,.dwg,.dxf,.step,.stp"
                onChange={handleTechnicalDrawingSelect}
                className="flex-1"
              />
              {technicalDrawing && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  {technicalDrawing.name}
                </div>
              )}
            </div>
          </div>

          {/* Threads and Tapped Holes */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="has-threads"
                checked={hasThreads}
                onCheckedChange={(checked) => setHasThreads(checked as boolean)}
              />
              <Label htmlFor="has-threads" className="cursor-pointer">
                Do your parts need to tap threads?
              </Label>
            </div>
            {hasThreads && (
              <Textarea
                placeholder="Please specify if your part has any internal or external threads. PCBWay will not bear any assembly risk if it is a non-standard thread, unless all assembly parts are produced and assembled here. e.g."
                value={threadsDescription}
                onChange={(e) => setThreadsDescription(e.target.value)}
              />
            )}
          </div>

          {/* Inserts */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="has-inserts"
                checked={hasInserts}
                onCheckedChange={(checked) => setHasInserts(checked as boolean)}
              />
              <Label htmlFor="has-inserts" className="cursor-pointer">
                Please specify the standard inserts in your part. e.g.
              </Label>
            </div>
            {hasInserts && (
              <Textarea
                placeholder="Specify inserts..."
                value={insertsDescription}
                onChange={(e) => setInsertsDescription(e.target.value)}
              />
            )}
          </div>

          {/* Tolerance */}
          <div className="space-y-4">
            <Label>Tolerance</Label>
            <p className="text-sm text-gray-500">
              Tolerances will be controlled with ISO 2768-1. For other tighter tolerances, technical drawing will be required to indicate critical dimensions.
            </p>
            <RadioGroup value={toleranceType} onValueChange={(v: 'standard' | 'tighter') => setToleranceType(v)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="standard" id="tolerance-standard" />
                <Label htmlFor="tolerance-standard" className="cursor-pointer">
                  No tighter tolerances required (ISO 2768-1)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="tighter" id="tolerance-tighter" />
                <Label htmlFor="tolerance-tighter" className="cursor-pointer">
                  Tighter tolerances required
                </Label>
              </div>
            </RadioGroup>
            {toleranceType === 'tighter' && (
              <Textarea
                placeholder="Specify tolerance requirements..."
                value={toleranceDescription}
                onChange={(e) => setToleranceDescription(e.target.value)}
              />
            )}
          </div>

          {/* Surface Roughness */}
          <div className="space-y-2">
            <Label htmlFor="surface-roughness">Surface Roughness</Label>
            <p className="text-sm text-gray-500 mb-2">
              Surface roughness will be controlled into 250uin/6.3um Ra unless you have other surface roughness required. e.g.
            </p>
            <Select value={surfaceRoughness} onValueChange={setSurfaceRoughness}>
              <SelectTrigger id="surface-roughness">
                <SelectValue placeholder="Select surface roughness" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="250uin/6.3um Ra">250uin/6.3um Ra</SelectItem>
                <SelectItem value="125uin/3.2um Ra">125uin/3.2um Ra</SelectItem>
                <SelectItem value="63uin/1.6um Ra">63uin/1.6um Ra</SelectItem>
                <SelectItem value="32uin/0.8um Ra">32uin/0.8um Ra</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Part Marking */}
          <div className="space-y-2">
            <Label htmlFor="part-marking">Part Marking</Label>
            <Select value={selectedPartMarking} onValueChange={setSelectedPartMarking}>
              <SelectTrigger id="part-marking">
                <SelectValue placeholder="Select part marking" />
              </SelectTrigger>
              <SelectContent>
                {partMarkingTypes.map((marking) => (
                  <SelectItem key={marking.id} value={marking.id}>
                    {marking.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Parts Assembly */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="has-assembly"
                checked={hasAssembly}
                onCheckedChange={(checked) => setHasAssembly(checked as boolean)}
              />
              <Label htmlFor="has-assembly" className="cursor-pointer">
                Please specify the assembly requirements. PCBWay does not bear any assembly risk if you choose No assembly requirement. e.g.
              </Label>
            </div>
            {hasAssembly && (
              <Select value={assemblyType} onValueChange={(v: 'no_assembly' | 'assembly_test' | 'ship_in_assembly') => setAssemblyType(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select assembly type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no_assembly">No Assembly</SelectItem>
                  <SelectItem value="assembly_test">Assembly test</SelectItem>
                  <SelectItem value="ship_in_assembly">Ship in assembly</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Finished Appearance */}
          <div className="space-y-4">
            <Label>Finished Appearance</Label>
            <RadioGroup value={finishedAppearance} onValueChange={(v: 'standard' | 'premium') => setFinishedAppearance(v)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="standard" id="appearance-standard" />
                <Label htmlFor="appearance-standard" className="cursor-pointer">
                  Standard - Normal processing traces or scratches caused during production, or subtle traces left after surface finish.
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="premium" id="appearance-premium" />
                <Label htmlFor="appearance-premium" className="cursor-pointer">
                  Premium (Extra charges) - Higher appearance requirements, the surface is clean and smooth without obvious flaws.
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Inspection */}
          <div className="space-y-2">
            <Label htmlFor="inspection">Inspection</Label>
            <p className="text-sm text-gray-500 mb-2">
              The inspection report will not be sent out with your parts unless you need it.
            </p>
            <Select value={selectedInspection} onValueChange={setSelectedInspection}>
              <SelectTrigger id="inspection">
                <SelectValue placeholder="Select inspection type" />
              </SelectTrigger>
              <SelectContent>
                {inspectionTypes.map((inspection) => (
                  <SelectItem key={inspection.id} value={inspection.id}>
                    {inspection.name} {inspection.has_extra_fee ? '(Pay extra)' : '(No extra fee)'}
                    {inspection.requires_drawing && ' - 2D technical drawings are required'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Section */}
      <Card>
        <CardHeader>
          <CardTitle>3. Compliance and Terms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="itar-compliance"
              checked={itarCompliance}
              onCheckedChange={(checked) => setItarCompliance(checked as boolean)}
            />
            <Label htmlFor="itar-compliance" className="cursor-pointer">
              Your technical data and any related item are not (1) controlled under the ITAR, (2) subject to the EAR, and controlled at any level beyond EAR99 or (3) a weapon or any similar or related item or component thereto.
            </Label>
          </div>
          <div className="flex items-start space-x-2">
            <Checkbox
              id="nda-acknowledged"
              checked={ndaAcknowledged}
              onCheckedChange={(checked) => setNdaAcknowledged(checked as boolean)}
              required
            />
            <Label htmlFor="nda-acknowledged" className="cursor-pointer">
              Your files are strictly confidential, sign an NDA here. *
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Preview Section */}
      {pricing && files.length > 0 && selectedMaterialType && (
        <Card className="border-polyform-green-200 bg-polyform-green-50/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calculator className="w-5 h-5 text-polyform-green-600" />
              <span>Price Estimate</span>
            </CardTitle>
            <CardDescription>
              Estimated pricing based on your configuration. Final price may vary after file review.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Price Range */}
            <div className="text-center space-y-2">
              <div className="text-sm text-gray-600">Estimated Price Range</div>
              <div className="flex items-center justify-center space-x-4">
                <div className="text-2xl font-bold text-polyform-green-600">
                  ${pricing.minPrice.toFixed(2)} - ${pricing.maxPrice.toFixed(2)}
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Best estimate: <span className="font-semibold text-gray-700">${pricing.estimatedPrice.toFixed(2)}</span>
              </div>
              {quantity > 1 && (
                <div className="text-xs text-gray-500 pt-1">
                  Per unit: ${(pricing.estimatedPrice / quantity).toFixed(2)}
                  {quantity >= 5 && (
                    <Badge variant="secondary" className="ml-2">
                      {quantity >= 10 ? '15%' : '10%'} bulk discount
                    </Badge>
                  )}
                </div>
              )}
            </div>

            <Separator />

            {/* Price Breakdown */}
            <div className="space-y-3">
              <div className="text-sm font-medium text-gray-700 mb-2">Cost Breakdown</div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Material Cost</span>
                <span className="font-medium">
                  ${pricing.breakdown.materialCost.min.toFixed(2)} - ${pricing.breakdown.materialCost.max.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Labor Cost</span>
                <span className="font-medium">
                  ${pricing.breakdown.laborCost.min.toFixed(2)} - ${pricing.breakdown.laborCost.max.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Setup Cost</span>
                <span className="font-medium">${pricing.breakdown.setupCost.toFixed(2)}</span>
              </div>
              {(pricing.breakdown.additionalCosts.estimated > 0) && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Additional Services</span>
                  <span className="font-medium">
                    ${pricing.breakdown.additionalCosts.min.toFixed(2)} - ${pricing.breakdown.additionalCosts.max.toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            <Separator />

            {/* Estimated Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="w-4 h-4 text-gray-500 mr-1" />
                  <span className="text-sm font-medium text-gray-600">Production Time</span>
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {pricing.estimatedTime.toFixed(1)}h
                </div>
              </div>
              
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <Truck className="w-4 h-4 text-gray-500 mr-1" />
                  <span className="text-sm font-medium text-gray-600">Estimated Delivery</span>
                </div>
                <div className="text-sm font-semibold text-gray-900">
                  {pricing.estimatedDelivery.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription className="text-xs">
                This is an estimated price range. Final pricing will be confirmed after our team reviews your files and specifications.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <Button
          type="submit"
          size="lg"
          className="bg-polyform-green-600 hover:bg-polyform-green-700 text-white"
          disabled={isSubmitting || files.length === 0}
        >
          {isSubmitting ? 'Submitting Order...' : 'Submit Order for Quote'}
        </Button>
      </div>
    </form>
  );
};

export default ComprehensiveUploadForm;

