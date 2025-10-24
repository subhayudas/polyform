
interface PricingFactors {
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
