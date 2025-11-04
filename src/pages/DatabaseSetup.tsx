import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import DatabaseSetupVerifier from '@/components/DatabaseSetupVerifier';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, FileText, Database } from 'lucide-react';

const DatabaseSetup = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Database Setup & Verification</h1>
          <p className="text-xl text-gray-600">
            Verify and set up your database for the comprehensive manufacturing system
          </p>
        </div>

        {/* Instructions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              How to Apply Migrations
            </CardTitle>
            <CardDescription>
              Follow these steps to set up your database
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Option 1: Supabase Dashboard (Recommended)</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 ml-4">
                <li>Go to your <a href="https://app.supabase.com" target="_blank" rel="noopener noreferrer" className="text-polyform-green-600 hover:underline">Supabase Dashboard</a></li>
                <li>Navigate to your project: <code className="bg-gray-100 px-1 py-0.5 rounded">tqkhoiiqqwaywnsmdgva</code></li>
                <li>Click on <strong>SQL Editor</strong> in the left sidebar</li>
                <li>Click <strong>New Query</strong></li>
                <li>Copy and paste the contents of <code className="bg-gray-100 px-1 py-0.5 rounded">supabase/migrations/20250117000000_comprehensive_manufacturing_system.sql</code></li>
                <li>Click <strong>Run</strong> to execute the migration</li>
                <li>Repeat for <code className="bg-gray-100 px-1 py-0.5 rounded">supabase/migrations/20250117000001_fix_comprehensive_system.sql</code></li>
              </ol>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <h3 className="font-semibold">Option 2: Supabase CLI</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 ml-4">
                <li>Ensure Docker is running</li>
                <li>Link to your project: <code className="bg-gray-100 px-1 py-0.5 rounded">supabase link --project-ref tqkhoiiqqwaywnsmdgva</code></li>
                <li>Push migrations: <code className="bg-gray-100 px-1 py-0.5 rounded">supabase db push</code></li>
              </ol>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Note:</strong> The migrations are idempotent (safe to run multiple times). They use <code>IF NOT EXISTS</code> and <code>ON CONFLICT DO NOTHING</code> to prevent errors if run again.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Migration Files Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Migration Files
            </CardTitle>
            <CardDescription>
              Migration files to apply (in order)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-sm">1. Comprehensive Manufacturing System</div>
                <div className="text-xs text-gray-600 mt-1">
                  <code>supabase/migrations/20250117000000_comprehensive_manufacturing_system.sql</code>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Creates: manufacturing_processes, material_types, material_variants, surface_finishes, part_marking_types, inspection_types tables and adds new columns to orders table
                </div>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-sm">2. Fix Comprehensive System</div>
                <div className="text-xs text-gray-600 mt-1">
                  <code>supabase/migrations/20250117000001_fix_comprehensive_system.sql</code>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Fixes RLS policies, updates order_files table, adds indexes, and ensures all tables are properly configured
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Verification */}
        <DatabaseSetupVerifier />
      </div>

      <Footer />
    </div>
  );
};

export default DatabaseSetup;


