/**
 * Database Verification Utility
 * 
 * This utility checks if all required database tables and columns exist
 * and are properly configured for the comprehensive manufacturing system.
 */

import { supabase } from '@/integrations/supabase/client';

export interface VerificationResult {
  success: boolean;
  message: string;
  details?: any;
}

export const verifyDatabase = async (): Promise<VerificationResult[]> => {
  const results: VerificationResult[] = [];

  // Check manufacturing_processes table
  try {
    const { data, error } = await supabase
      .from('manufacturing_processes')
      .select('id, name, category, sub_processes')
      .limit(1);
    
    if (error) {
      results.push({
        success: false,
        message: 'manufacturing_processes table not accessible',
        details: error.message
      });
    } else {
      results.push({
        success: true,
        message: 'manufacturing_processes table accessible',
        details: data?.length || 0
      });
    }
  } catch (error: any) {
    results.push({
      success: false,
      message: 'manufacturing_processes table check failed',
      details: error.message
    });
  }

  // Check material_types table
  try {
    const { data, error } = await supabase
      .from('material_types')
      .select('id, name, category')
      .limit(1);
    
    if (error) {
      results.push({
        success: false,
        message: 'material_types table not accessible',
        details: error.message
      });
    } else {
      results.push({
        success: true,
        message: 'material_types table accessible',
        details: data?.length || 0
      });
    }
  } catch (error: any) {
    results.push({
      success: false,
      message: 'material_types table check failed',
      details: error.message
    });
  }

  // Check material_variants table
  try {
    const { data, error } = await supabase
      .from('material_variants')
      .select('id, name, material_type_id')
      .limit(1);
    
    if (error) {
      results.push({
        success: false,
        message: 'material_variants table not accessible',
        details: error.message
      });
    } else {
      results.push({
        success: true,
        message: 'material_variants table accessible',
        details: data?.length || 0
      });
    }
  } catch (error: any) {
    results.push({
      success: false,
      message: 'material_variants table check failed',
      details: error.message
    });
  }

  // Check surface_finishes table
  try {
    const { data, error } = await supabase
      .from('surface_finishes')
      .select('id, name, roughness_value')
      .limit(1);
    
    if (error) {
      results.push({
        success: false,
        message: 'surface_finishes table not accessible',
        details: error.message
      });
    } else {
      results.push({
        success: true,
        message: 'surface_finishes table accessible',
        details: data?.length || 0
      });
    }
  } catch (error: any) {
    results.push({
      success: false,
      message: 'surface_finishes table check failed',
      details: error.message
    });
  }

  // Check part_marking_types table
  try {
    const { data, error } = await supabase
      .from('part_marking_types')
      .select('id, name')
      .limit(1);
    
    if (error) {
      results.push({
        success: false,
        message: 'part_marking_types table not accessible',
        details: error.message
      });
    } else {
      results.push({
        success: true,
        message: 'part_marking_types table accessible',
        details: data?.length || 0
      });
    }
  } catch (error: any) {
    results.push({
      success: false,
      message: 'part_marking_types table check failed',
      details: error.message
    });
  }

  // Check inspection_types table
  try {
    const { data, error } = await supabase
      .from('inspection_types')
      .select('id, name, requires_drawing, has_extra_fee')
      .limit(1);
    
    if (error) {
      results.push({
        success: false,
        message: 'inspection_types table not accessible',
        details: error.message
      });
    } else {
      results.push({
        success: true,
        message: 'inspection_types table accessible',
        details: data?.length || 0
      });
    }
  } catch (error: any) {
    results.push({
      success: false,
      message: 'inspection_types table check failed',
      details: error.message
    });
  }

  // Check orders table has new columns
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('manufacturing_process_id, material_type_id, material_variant_id, design_units')
      .limit(1);
    
    if (error) {
      // Check if error is about missing columns
      if (error.message.includes('column') && error.message.includes('does not exist')) {
        results.push({
          success: false,
          message: 'orders table missing new columns',
          details: 'Please run the comprehensive manufacturing system migration'
        });
      } else {
        results.push({
          success: false,
          message: 'orders table check failed',
          details: error.message
        });
      }
    } else {
      results.push({
        success: true,
        message: 'orders table has all new columns',
      });
    }
  } catch (error: any) {
    results.push({
      success: false,
      message: 'orders table check failed',
      details: error.message
    });
  }

  // Check order_files table has technical_drawing category
  try {
    const { data, error } = await supabase
      .from('order_files')
      .select('file_category')
      .limit(1);
    
    if (error) {
      results.push({
        success: false,
        message: 'order_files table not accessible',
        details: error.message
      });
    } else {
      results.push({
        success: true,
        message: 'order_files table accessible',
      });
    }
  } catch (error: any) {
    results.push({
      success: false,
      message: 'order_files table check failed',
      details: error.message
    });
  }

  return results;
};



