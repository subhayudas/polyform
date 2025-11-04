import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle2, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface VerificationResult {
  table: string;
  success: boolean;
  message: string;
  details?: any;
}

const DatabaseSetupVerifier: React.FC = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [results, setResults] = useState<VerificationResult[]>([]);
  const { toast } = useToast();

  const runVerification = async () => {
    setIsVerifying(true);
    setResults([]);
    
    const newResults: VerificationResult[] = [];

    // Check manufacturing_processes
    try {
      const { data, error } = await supabase
        .from('manufacturing_processes')
        .select('id, name, category, sub_processes')
        .limit(1);
      
      if (error) {
        newResults.push({
          table: 'manufacturing_processes',
          success: false,
          message: 'Table not accessible',
          details: error.message
        });
      } else {
        newResults.push({
          table: 'manufacturing_processes',
          success: true,
          message: `Table accessible (${data?.length || 0} records found)`,
        });
      }
    } catch (error: any) {
      newResults.push({
        table: 'manufacturing_processes',
        success: false,
        message: 'Table check failed',
        details: error.message
      });
    }

    // Check material_types
    try {
      const { data, error } = await supabase
        .from('material_types')
        .select('id, name, category')
        .limit(1);
      
      if (error) {
        newResults.push({
          table: 'material_types',
          success: false,
          message: 'Table not accessible',
          details: error.message
        });
      } else {
        newResults.push({
          table: 'material_types',
          success: true,
          message: `Table accessible (${data?.length || 0} records found)`,
        });
      }
    } catch (error: any) {
      newResults.push({
        table: 'material_types',
        success: false,
        message: 'Table check failed',
        details: error.message
      });
    }

    // Check material_variants
    try {
      const { data, error } = await supabase
        .from('material_variants')
        .select('id, name, material_type_id')
        .limit(1);
      
      if (error) {
        newResults.push({
          table: 'material_variants',
          success: false,
          message: 'Table not accessible',
          details: error.message
        });
      } else {
        newResults.push({
          table: 'material_variants',
          success: true,
          message: `Table accessible (${data?.length || 0} records found)`,
        });
      }
    } catch (error: any) {
      newResults.push({
        table: 'material_variants',
        success: false,
        message: 'Table check failed',
        details: error.message
      });
    }

    // Check surface_finishes
    try {
      const { data, error } = await supabase
        .from('surface_finishes')
        .select('id, name, roughness_value')
        .limit(1);
      
      if (error) {
        newResults.push({
          table: 'surface_finishes',
          success: false,
          message: 'Table not accessible',
          details: error.message
        });
      } else {
        newResults.push({
          table: 'surface_finishes',
          success: true,
          message: `Table accessible (${data?.length || 0} records found)`,
        });
      }
    } catch (error: any) {
      newResults.push({
        table: 'surface_finishes',
        success: false,
        message: 'Table check failed',
        details: error.message
      });
    }

    // Check part_marking_types
    try {
      const { data, error } = await supabase
        .from('part_marking_types')
        .select('id, name')
        .limit(1);
      
      if (error) {
        newResults.push({
          table: 'part_marking_types',
          success: false,
          message: 'Table not accessible',
          details: error.message
        });
      } else {
        newResults.push({
          table: 'part_marking_types',
          success: true,
          message: `Table accessible (${data?.length || 0} records found)`,
        });
      }
    } catch (error: any) {
      newResults.push({
        table: 'part_marking_types',
        success: false,
        message: 'Table check failed',
        details: error.message
      });
    }

    // Check inspection_types
    try {
      const { data, error } = await supabase
        .from('inspection_types')
        .select('id, name, requires_drawing, has_extra_fee')
        .limit(1);
      
      if (error) {
        newResults.push({
          table: 'inspection_types',
          success: false,
          message: 'Table not accessible',
          details: error.message
        });
      } else {
        newResults.push({
          table: 'inspection_types',
          success: true,
          message: `Table accessible (${data?.length || 0} records found)`,
        });
      }
    } catch (error: any) {
      newResults.push({
        table: 'inspection_types',
        success: false,
        message: 'Table check failed',
        details: error.message
      });
    }

    // Check orders table has new columns
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('manufacturing_process_id, material_type_id, material_variant_id, design_units, surface_finish_id')
        .limit(1);
      
      if (error) {
        if (error.message.includes('column') && error.message.includes('does not exist')) {
          newResults.push({
            table: 'orders (new columns)',
            success: false,
            message: 'Missing new columns - migrations not applied',
            details: 'Please run the comprehensive manufacturing system migrations'
          });
        } else {
          newResults.push({
            table: 'orders (new columns)',
            success: false,
            message: 'Query failed',
            details: error.message
          });
        }
      } else {
        newResults.push({
          table: 'orders (new columns)',
          success: true,
          message: 'All new columns exist',
        });
      }
    } catch (error: any) {
      newResults.push({
        table: 'orders (new columns)',
        success: false,
        message: 'Check failed',
        details: error.message
      });
    }

    // Check order_files table
    try {
      const { data, error } = await supabase
        .from('order_files')
        .select('file_category, file_size')
        .limit(1);
      
      if (error) {
        newResults.push({
          table: 'order_files',
          success: false,
          message: 'Table not accessible',
          details: error.message
        });
      } else {
        newResults.push({
          table: 'order_files',
          success: true,
          message: 'Table accessible',
        });
      }
    } catch (error: any) {
      newResults.push({
        table: 'order_files',
        success: false,
        message: 'Check failed',
        details: error.message
      });
    }

    // Check if data is seeded
    try {
      const { data: processes, error: procError } = await supabase
        .from('manufacturing_processes')
        .select('id')
        .limit(1);
      
      const { data: materials, error: matError } = await supabase
        .from('material_types')
        .select('id')
        .limit(1);
      
      const { data: variants, error: varError } = await supabase
        .from('material_variants')
        .select('id')
        .limit(1);

      if (procError || matError || varError) {
        newResults.push({
          table: 'Data Seeding',
          success: false,
          message: 'Unable to check data seeding',
          details: procError?.message || matError?.message || varError?.message
        });
      } else {
        const hasData = (processes?.length || 0) > 0 && (materials?.length || 0) > 0 && (variants?.length || 0) > 0;
        newResults.push({
          table: 'Data Seeding',
          success: hasData,
          message: hasData ? 'Data appears to be seeded' : 'Data may not be seeded',
        });
      }
    } catch (error: any) {
      newResults.push({
        table: 'Data Seeding',
        success: false,
        message: 'Check failed',
        details: error.message
      });
    }

    setResults(newResults);
    setIsVerifying(false);

    const successCount = newResults.filter(r => r.success).length;
    const totalCount = newResults.length;

    if (successCount === totalCount) {
      toast({
        title: "✅ Database Setup Verified",
        description: `All ${totalCount} checks passed successfully!`,
      });
    } else {
      toast({
        title: "⚠️ Database Setup Issues",
        description: `${successCount}/${totalCount} checks passed. Please review the results.`,
        variant: "destructive",
      });
    }
  };

  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;
  const allPassed = totalCount > 0 && successCount === totalCount;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Database Setup Verification</CardTitle>
        <CardDescription>
          Verify that all database tables, columns, and data are properly set up
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Button
            onClick={runVerification}
            disabled={isVerifying}
            className="bg-polyform-green-600 hover:bg-polyform-green-700"
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              'Run Verification'
            )}
          </Button>
          
          {totalCount > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {successCount}/{totalCount} checks passed
              </span>
              {allPassed ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
            </div>
          )}
        </div>

        {results.length > 0 && (
          <div className="space-y-2">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  result.success
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  {result.success ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{result.table}</div>
                    <div className={`text-sm mt-1 ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                      {result.message}
                    </div>
                    {result.details && (
                      <div className="text-xs text-gray-600 mt-2 font-mono bg-gray-100 p-2 rounded">
                        {result.details}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!allPassed && totalCount > 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Some database tables or columns are missing. Please apply the migrations in the following order:
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>20250117000000_comprehensive_manufacturing_system.sql</li>
                <li>20250117000001_fix_comprehensive_system.sql</li>
              </ol>
              You can apply these migrations via the Supabase Dashboard SQL Editor or using Supabase CLI.
            </AlertDescription>
          </Alert>
        )}

        {allPassed && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              All database tables and columns are properly set up! The comprehensive manufacturing system is ready to use.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default DatabaseSetupVerifier;


