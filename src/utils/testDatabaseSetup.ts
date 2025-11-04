/**
 * Test Database Setup
 * This script tests the database connection and checks what tables exist
 */

import { supabase } from '@/integrations/supabase/client';

export interface TableCheck {
  table: string;
  exists: boolean;
  error?: string;
  hasData?: boolean;
}

export const testDatabaseSetup = async (): Promise<TableCheck[]> => {
  const tablesToCheck = [
    'manufacturing_processes',
    'material_types',
    'material_variants',
    'surface_finishes',
    'part_marking_types',
    'inspection_types',
    'orders',
    'order_files',
    'materials',
    'profiles',
    'user_roles',
  ];

  const results: TableCheck[] = [];

  for (const table of tablesToCheck) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (error) {
        // Check if it's a "table doesn't exist" error
        if (error.message.includes('does not exist') || error.message.includes('relation') || error.code === '42P01') {
          results.push({
            table,
            exists: false,
            error: 'Table does not exist',
          });
        } else {
          results.push({
            table,
            exists: true,
            error: error.message,
            hasData: false,
          });
        }
      } else {
        results.push({
          table,
          exists: true,
          hasData: (data?.length || 0) > 0,
        });
      }
    } catch (error: any) {
      results.push({
        table,
        exists: false,
        error: error.message,
      });
    }
  }

  return results;
};


