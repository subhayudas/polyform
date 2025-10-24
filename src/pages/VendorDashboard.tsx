
import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import VendorApplicationStatus from '@/components/partners/vendor-form/VendorApplicationStatus';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const VendorDashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <section className="pt-20 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card>
              <CardHeader>
                <CardTitle>Please Log In</CardTitle>
                <CardDescription>
                  You need to be logged in to access your vendor dashboard.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/auth">
                  <Button>Log In</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Header */}
      <section className="pt-20 pb-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Vendor Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Track your vendor application status and manage your partnership
              </p>
            </div>
            <div className="flex gap-3">
              <Link to="/partners">
                <Button variant="outline">
                  Back to Partners
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <VendorApplicationStatus />
        </div>
      </section>

      <WhatsAppButton variant="fixed" />
      <Footer />
    </div>
  );
};

export default VendorDashboard;
