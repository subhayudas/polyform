export interface PricingFactors {
  volume: number; // in cubic mm
  surfaceArea: number; // in square mm
  complexity: number; // 1-5 scale
  supportRequired: boolean;
  infillPercentage: number;
}

interface MaterialPricing {
  [key: string]: {
    costPerGram: number;
    density: number; // g/cm³
    setupCost: number;
    complexityMultiplier: number;
  };
}

export interface MaterialPricingData {
  cost_per_unit: number;
  density: number;
  setup_cost: number;
  name?: string;
}

export interface SurfaceFinishData {
  cost_multiplier: number;
  name?: string;
}

export interface PartMarkingData {
  cost_multiplier: number;
  name?: string;
}

export interface InspectionData {
  has_extra_fee: boolean;
  name?: string;
}

export interface PricingOptions {
  manufacturingProcess?: string;
  materialType?: string;
  materialVariant?: string;
  materialName?: string;
  quantity: number;
  surfaceFinish?: boolean;
  surfaceFinishId?: string;
  tighterTolerance?: boolean;
  hasThreads?: boolean;
  hasInserts?: boolean;
  hasAssembly?: boolean;
  assemblyType?: string;
  finishedAppearance?: 'standard' | 'premium';
  partMarking?: boolean;
  partMarkingId?: string;
  inspectionType?: boolean;
  inspectionId?: string;
  itarCompliance?: boolean;
  // Database pricing data
  materialPricing?: MaterialPricingData;
  surfaceFinishPricing?: SurfaceFinishData;
  partMarkingPricing?: PartMarkingData;
  inspectionPricing?: InspectionData;
}

const MATERIAL_PRICING: MaterialPricing = {
  'PLA': {
    costPerGram: 0.05,
    density: 1.24,
    setupCost: 5,
    complexityMultiplier: 1.0
  },
  'ABS': {
    costPerGram: 0.06,
    density: 1.04,
    setupCost: 5,
    complexityMultiplier: 1.1
  },
  'PETG': {
    costPerGram: 0.08,
    density: 1.27,
    setupCost: 8,
    complexityMultiplier: 1.2
  },
  'TPU': {
    costPerGram: 0.15,
    density: 1.20,
    setupCost: 12,
    complexityMultiplier: 1.5
  },
  'ASA': {
    costPerGram: 0.10,
    density: 1.07,
    setupCost: 10,
    complexityMultiplier: 1.3
  },
  'PVA': {
    costPerGram: 0.20,
    density: 1.23,
    setupCost: 15,
    complexityMultiplier: 1.4
  },
  'HIPS': {
    costPerGram: 0.07,
    density: 1.04,
    setupCost: 6,
    complexityMultiplier: 1.1
  },
  'Wood Fill': {
    costPerGram: 0.12,
    density: 1.28,
    setupCost: 10,
    complexityMultiplier: 1.3
  },
  'Metal Fill': {
    costPerGram: 0.25,
    density: 2.8,
    setupCost: 20,
    complexityMultiplier: 1.6
  },
  'Carbon Fiber': {
    costPerGram: 0.30,
    density: 1.3,
    setupCost: 25,
    complexityMultiplier: 1.8
  }
};

// Estimate basic properties from file size and type
export const estimateFileProperties = (file: File): PricingFactors => {
  const fileSizeKB = file.size / 1024;
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  
  // Rough estimates based on file size and type
  let estimatedVolume: number;
  let estimatedSurfaceArea: number;
  let complexity: number;
  let supportRequired: boolean;
  
  if (fileExtension === 'stl' || fileExtension === 'obj' || fileExtension === '3mf') {
    // For 3D model files, estimate based on file size
    estimatedVolume = Math.max(1000, fileSizeKB * 50); // mm³
    estimatedSurfaceArea = Math.max(500, fileSizeKB * 25); // mm²
    complexity = Math.min(5, Math.max(1, Math.ceil(fileSizeKB / 500)));
    supportRequired = fileSizeKB > 1000; // Assume larger files need support
  } else {
    // For document files, use default small prototype values
    estimatedVolume = 5000; // mm³ (small prototype)
    estimatedSurfaceArea = 1500; // mm²
    complexity = 2;
    supportRequired = false;
  }
  
  return {
    volume: estimatedVolume,
    surfaceArea: estimatedSurfaceArea,
    complexity,
    supportRequired,
    infillPercentage: 20 // Default infill
  };
};

export const calculatePrintingCost = (
  factors: PricingFactors,
  material: string,
  quantity: number = 1
): {
  materialCost: number;
  laborCost: number;
  setupCost: number;
  complexityCost: number;
  total: number;
  estimatedTime: number; // in hours
  weight: number; // in grams
} => {
  const materialData = MATERIAL_PRICING[material];
  
  if (!materialData) {
    throw new Error(`Unknown material: ${material}`);
  }
  
  // Calculate volume in cm³
  const volumeCm3 = factors.volume / 1000;
  
  // Calculate weight based on infill percentage
  const effectiveVolume = volumeCm3 * (factors.infillPercentage / 100);
  const weight = effectiveVolume * materialData.density;
  
  // Calculate costs
  const materialCost = weight * materialData.costPerGram;
  const setupCost = materialData.setupCost;
  
  // Estimate printing time (rough calculation)
  const baseTime = volumeCm3 * 0.5; // 0.5 hours per cm³ base time
  const complexityTimeMultiplier = 1 + (factors.complexity - 1) * 0.3;
  const supportTimeMultiplier = factors.supportRequired ? 1.5 : 1;
  const estimatedTime = baseTime * complexityTimeMultiplier * supportTimeMultiplier;
  
  // Labor cost based on estimated time
  const laborCost = estimatedTime * 15; // $15/hour labor rate
  
  // Complexity cost
  const complexityCost = factors.complexity * 2;
  
  // Calculate total for single item
  const singleItemTotal = materialCost + laborCost + setupCost + complexityCost;
  
  // Apply quantity discounts
  let quantityMultiplier = 1;
  if (quantity >= 10) {
    quantityMultiplier = 0.85; // 15% discount for 10+
  } else if (quantity >= 5) {
    quantityMultiplier = 0.9; // 10% discount for 5+
  }
  
  const total = singleItemTotal * quantity * quantityMultiplier;
  
  return {
    materialCost: materialCost * quantity,
    laborCost: laborCost * quantity * quantityMultiplier,
    setupCost,
    complexityCost: complexityCost * quantity,
    total,
    estimatedTime: estimatedTime * quantity,
    weight: weight * quantity
  };
};

export const formatEstimatedDelivery = (estimatedTime: number): Date => {
  const now = new Date();
  const productionDays = Math.ceil(estimatedTime / 8); // 8 hours per day
  const bufferDays = Math.max(1, Math.ceil(productionDays * 0.5)); // 50% buffer
  const totalDays = productionDays + bufferDays;
  
  // Add weekends
  const deliveryDate = new Date(now);
  let daysAdded = 0;
  
  while (daysAdded < totalDays) {
    deliveryDate.setDate(deliveryDate.getDate() + 1);
    // Skip weekends
    if (deliveryDate.getDay() !== 0 && deliveryDate.getDay() !== 6) {
      daysAdded++;
    }
  }
  
  return deliveryDate;
};

// Calculate price range for manufacturing order
export const calculatePriceRange = (
  files: File[],
  options: PricingOptions
): {
  minPrice: number;
  maxPrice: number;
  estimatedPrice: number;
  breakdown: {
    materialCost: { min: number; max: number; estimated: number };
    laborCost: { min: number; max: number; estimated: number };
    setupCost: number;
    additionalCosts: { min: number; max: number; estimated: number };
  };
  estimatedTime: number;
  estimatedDelivery: Date;
} => {
  if (files.length === 0) {
    return {
      minPrice: 0,
      maxPrice: 0,
      estimatedPrice: 0,
      breakdown: {
        materialCost: { min: 0, max: 0, estimated: 0 },
        laborCost: { min: 0, max: 0, estimated: 0 },
        setupCost: 0,
        additionalCosts: { min: 0, max: 0, estimated: 0 },
      },
      estimatedTime: 0,
      estimatedDelivery: new Date(),
    };
  }

  // Estimate properties for all files combined
  let totalVolume = 0;
  let totalSurfaceArea = 0;
  let maxComplexity = 1;
  let anySupportRequired = false;
  let totalFileSizeKB = 0;

  files.forEach((file) => {
    const props = estimateFileProperties(file);
    totalVolume += props.volume;
    totalSurfaceArea += props.surfaceArea;
    maxComplexity = Math.max(maxComplexity, props.complexity);
    if (props.supportRequired) anySupportRequired = true;
    totalFileSizeKB += file.size / 1024;
  });

  const avgVolume = totalVolume / files.length;
  const avgComplexity = maxComplexity;

  // Get material pricing - use database data if available, otherwise fallback to hardcoded
  let materialData: {
    costPerGram: number;
    density: number;
    setupCost: number;
    complexityMultiplier: number;
  };

  if (options.materialPricing) {
    // Use database pricing data
    materialData = {
      costPerGram: options.materialPricing.cost_per_unit,
      density: options.materialPricing.density,
      setupCost: options.materialPricing.setup_cost,
      complexityMultiplier: 1.0, // Default, can be adjusted based on material
    };
  } else {
    // Fallback to hardcoded pricing
    const materialName = options.materialVariant || options.materialName || options.materialType || 'PLA';
    
    // Try to find matching material (handle partial matches)
    let matchedMaterial = MATERIAL_PRICING[materialName];
    if (!matchedMaterial) {
      // Try to find by partial match (e.g., "PLA - White" matches "PLA")
      const materialKeys = Object.keys(MATERIAL_PRICING);
      const matchedKey = materialKeys.find(key => 
        materialName.toUpperCase().includes(key.toUpperCase()) || 
        key.toUpperCase().includes(materialName.toUpperCase())
      );
      matchedMaterial = matchedKey ? MATERIAL_PRICING[matchedKey] : MATERIAL_PRICING['PLA'];
    }
    materialData = matchedMaterial;
  }

  // Calculate base costs
  const volumeCm3 = avgVolume / 1000;
  const effectiveVolume = volumeCm3 * 0.2; // 20% infill default
  const weight = effectiveVolume * materialData.density;

  // Material cost with uncertainty range
  const baseMaterialCost = weight * materialData.costPerGram;
  const materialCostMin = baseMaterialCost * 0.8; // -20% uncertainty
  const materialCostMax = baseMaterialCost * 1.3; // +30% uncertainty

  // Setup cost (one-time per order)
  const setupCost = materialData.setupCost;

  // Labor cost estimation
  const baseTime = volumeCm3 * 0.5; // hours
  const complexityMultiplier = 1 + (avgComplexity - 1) * 0.3;
  const supportMultiplier = anySupportRequired ? 1.5 : 1;
  const estimatedTime = baseTime * complexityMultiplier * supportMultiplier * options.quantity;

  // Labor cost with uncertainty
  const laborRate = 15; // $/hour
  const baseLaborCost = estimatedTime * laborRate;
  const laborCostMin = baseLaborCost * 0.7; // -30% uncertainty
  const laborCostMax = baseLaborCost * 1.4; // +40% uncertainty

  // Calculate base price for percentage-based calculations (single item)
  const basePricePerItem = baseMaterialCost + baseLaborCost + setupCost;

  // Additional costs based on options
  let additionalCosts = 0;
  let additionalCostsMin = 0;
  let additionalCostsMax = 0;

  // Tighter tolerance
  if (options.tighterTolerance) {
    additionalCosts += 10;
    additionalCostsMin += 7;
    additionalCostsMax += 15;
  }

  // Threads
  if (options.hasThreads) {
    additionalCosts += 8;
    additionalCostsMin += 5;
    additionalCostsMax += 12;
  }

  // Inserts
  if (options.hasInserts) {
    additionalCosts += 12;
    additionalCostsMin += 8;
    additionalCostsMax += 18;
  }

  // Assembly
  if (options.hasAssembly) {
    if (options.assemblyType === 'assembly_test') {
      additionalCosts += 20;
      additionalCostsMin += 15;
      additionalCostsMax += 30;
    } else if (options.assemblyType === 'ship_in_assembly') {
      additionalCosts += 30;
      additionalCostsMin += 20;
      additionalCostsMax += 45;
    }
  }

  // Premium appearance
  if (options.finishedAppearance === 'premium') {
    additionalCosts += 15;
    additionalCostsMin += 10;
    additionalCostsMax += 25;
  }

  // Surface finish premium - use database multiplier if available
  if (options.surfaceFinish) {
    if (options.surfaceFinishPricing) {
      // Apply cost multiplier from database (e.g., 1.2 = 20% increase)
      const baseFinishCost = basePricePerItem * 0.05; // 5% of base price
      const multiplier = options.surfaceFinishPricing.cost_multiplier;
      const finishCost = baseFinishCost * (multiplier - 1.0); // Only the additional cost
      additionalCosts += finishCost;
      additionalCostsMin += finishCost * 0.8;
      additionalCostsMax += finishCost * 1.3;
    } else {
      // Fallback to fixed cost
      additionalCosts += 5;
      additionalCostsMin += 3;
      additionalCostsMax += 8;
    }
  }

  // Part marking - use database multiplier if available
  if (options.partMarking) {
    if (options.partMarkingPricing) {
      // Apply cost multiplier from database
      const baseMarkingCost = basePricePerItem * 0.03; // 3% of base price
      const multiplier = options.partMarkingPricing.cost_multiplier;
      const markingCost = baseMarkingCost * (multiplier - 1.0); // Only the additional cost
      additionalCosts += markingCost;
      additionalCostsMin += markingCost * 0.8;
      additionalCostsMax += markingCost * 1.3;
    } else {
      // Fallback to fixed cost
      additionalCosts += 5;
      additionalCostsMin += 3;
      additionalCostsMax += 8;
    }
  }

  // Inspection - use database extra fee if available
  if (options.inspectionType) {
    if (options.inspectionPricing) {
      if (options.inspectionPricing.has_extra_fee) {
        // Inspection with extra fee - typically more expensive
        additionalCosts += 15;
        additionalCostsMin += 10;
        additionalCostsMax += 25;
      } else {
        // Standard inspection without extra fee
        additionalCosts += 5;
        additionalCostsMin += 3;
        additionalCostsMax += 8;
      }
    } else {
      // Fallback to fixed cost
      additionalCosts += 10;
      additionalCostsMin += 7;
      additionalCostsMax += 15;
    }
  }

  // ITAR compliance
  if (options.itarCompliance) {
    additionalCosts += 20;
    additionalCostsMin += 15;
    additionalCostsMax += 30;
  }

  // Apply quantity discounts
  let quantityMultiplier = 1;
  if (options.quantity >= 10) {
    quantityMultiplier = 0.85; // 15% discount
  } else if (options.quantity >= 5) {
    quantityMultiplier = 0.9; // 10% discount
  }

  // Calculate totals (with quantity)
  const materialCostTotal = baseMaterialCost * options.quantity;
  const materialCostMinTotal = materialCostMin * options.quantity * quantityMultiplier;
  const materialCostMaxTotal = materialCostMax * options.quantity * quantityMultiplier;

  const laborCostTotal = baseLaborCost * quantityMultiplier;
  const laborCostMinTotal = laborCostMin * quantityMultiplier;
  const laborCostMaxTotal = laborCostMax * quantityMultiplier;

  const additionalCostsTotal = additionalCosts * options.quantity;
  const additionalCostsMinTotal = additionalCostsMin * options.quantity;
  const additionalCostsMaxTotal = additionalCostsMax * options.quantity;

  // Calculate price range
  const estimatedPrice = (materialCostTotal + laborCostTotal + setupCost + additionalCostsTotal) * quantityMultiplier;
  const minPrice = materialCostMinTotal + laborCostMinTotal + setupCost + additionalCostsMinTotal;
  const maxPrice = materialCostMaxTotal + laborCostMaxTotal + setupCost + additionalCostsMaxTotal;

  // Calculate delivery date
  const estimatedDelivery = formatEstimatedDelivery(estimatedTime);

  return {
    minPrice: Math.max(0, minPrice),
    maxPrice: Math.max(0, maxPrice),
    estimatedPrice: Math.max(0, estimatedPrice),
    breakdown: {
      materialCost: {
        min: materialCostMinTotal,
        max: materialCostMaxTotal,
        estimated: materialCostTotal * quantityMultiplier,
      },
      laborCost: {
        min: laborCostMinTotal,
        max: laborCostMaxTotal,
        estimated: laborCostTotal,
      },
      setupCost,
      additionalCosts: {
        min: additionalCostsMinTotal,
        max: additionalCostsMaxTotal,
        estimated: additionalCostsTotal * quantityMultiplier,
      },
    },
    estimatedTime,
    estimatedDelivery,
  };
};
