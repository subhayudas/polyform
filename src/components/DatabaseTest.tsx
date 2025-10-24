import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const DatabaseTest: React.FC = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const runDatabaseTests = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please log in to run database tests.",
        variant: "destructive",
      });
      return;
    }

    setIsTesting(true);
    setTestResults([]);
    addResult('Starting database connection tests...');

    try {
      // Test 1: Check if we can connect to Supabase
      addResult('Test 1: Checking Supabase connection...');
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        addResult(`❌ Auth error: ${authError.message}`);
        throw authError;
      }
      addResult(`✅ Auth connection successful. User: ${authUser?.email}`);

      // Test 2: Check if we can query the orders table
      addResult('Test 2: Testing orders table access...');
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('id, user_id, file_name, status')
        .limit(5);

      if (ordersError) {
        addResult(`❌ Orders query error: ${ordersError.message}`);
        throw ordersError;
      }
      addResult(`✅ Orders query successful. Found ${ordersData?.length || 0} orders`);

      // Test 3: Check if we can query the profiles table
      addResult('Test 3: Testing profiles table access...');
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .limit(5);

      if (profilesError) {
        addResult(`❌ Profiles query error: ${profilesError.message}`);
        throw profilesError;
      }
      addResult(`✅ Profiles query successful. Found ${profilesData?.length || 0} profiles`);

      // Test 4: Check if we can query the materials table
      addResult('Test 4: Testing materials table access...');
      const { data: materialsData, error: materialsError } = await supabase
        .from('materials')
        .select('id, name, type')
        .limit(5);

      if (materialsError) {
        addResult(`❌ Materials query error: ${materialsError.message}`);
        throw materialsError;
      }
      addResult(`✅ Materials query successful. Found ${materialsData?.length || 0} materials`);

      // Test 5: Check if we can query user_roles table
      addResult('Test 5: Testing user_roles table access...');
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .eq('user_id', user.id);

      if (rolesError) {
        addResult(`❌ User roles query error: ${rolesError.message}`);
        throw rolesError;
      }
      addResult(`✅ User roles query successful. Found ${rolesData?.length || 0} roles for current user`);

      // Test 6: Try to create a test order
      addResult('Test 6: Testing order creation...');
      const { data: testOrder, error: createError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          file_name: 'database-test.stl',
          material: 'PLA',
          quantity: 1,
          notes: 'Database connection test order',
          price: 15.00,
          status: 'pending'
        })
        .select()
        .single();

      if (createError) {
        addResult(`❌ Order creation error: ${createError.message}`);
        throw createError;
      }
      addResult(`✅ Order creation successful. Order ID: ${testOrder.id}`);

      // Test 7: Try to fetch the created order
      addResult('Test 7: Testing order fetch...');
      const { data: fetchedOrder, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', testOrder.id)
        .single();

      if (fetchError) {
        addResult(`❌ Order fetch error: ${fetchError.message}`);
        throw fetchError;
      }
      addResult(`✅ Order fetch successful. Order: ${fetchedOrder.file_name}`);

      // Test 8: Clean up test order
      addResult('Test 8: Cleaning up test order...');
      const { error: deleteError } = await supabase
        .from('orders')
        .delete()
        .eq('id', testOrder.id);

      if (deleteError) {
        addResult(`⚠️ Cleanup error: ${deleteError.message}`);
      } else {
        addResult(`✅ Test order cleaned up successfully`);
      }

      addResult('🎉 All database tests passed successfully!');
      
      toast({
        title: "Database Tests Passed!",
        description: "All database connection tests completed successfully.",
      });

    } catch (error) {
      addResult(`❌ Test failed: ${error.message}`);
      toast({
        title: "Database Test Failed",
        description: `Error: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Database Connection Test</CardTitle>
        <p className="text-sm text-gray-600">
          Comprehensive test to verify database connectivity and functionality.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Current User: {user ? `${user.email} (${user.id})` : 'Not logged in'}
          </p>
        </div>
        
        <Button
          onClick={runDatabaseTests}
          disabled={isTesting || !user}
          className="bg-green-600 hover:bg-green-700"
        >
          {isTesting ? 'Running Tests...' : 'Run Database Tests'}
        </Button>
        
        {testResults.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium text-gray-900 mb-2">Test Results:</h4>
            <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                {testResults.join('\n')}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DatabaseTest;
