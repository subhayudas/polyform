import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Mail, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ComingSoon = () => {
  const { user, profile } = useAuth();
  const [waitlistEntry, setWaitlistEntry] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToWaitlist, setIsAddingToWaitlist] = useState(false);

  useEffect(() => {
    const checkAndAddToWaitlist = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        // Check if user is already in waitlist
        const { data: existingEntry, error: fetchError } = await supabase
          .from('waitlist')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          // PGRST116 is "not found" error, which is fine
          console.error('Error checking waitlist:', fetchError);
        }

        if (existingEntry) {
          setWaitlistEntry(existingEntry);
        } else {
          // Add user to waitlist
          setIsAddingToWaitlist(true);
          const { data: newEntry, error: insertError } = await supabase
            .from('waitlist')
            .insert({
              user_id: user.id,
              email: user.email || '',
              full_name: profile?.full_name || null,
              company: profile?.company || null,
              phone: profile?.phone || null,
              status: 'pending',
              notified_at: new Date().toISOString(),
            })
            .select()
            .single();

          if (insertError) {
            console.error('Error adding to waitlist:', insertError);
          } else {
            setWaitlistEntry(newEntry);
          }
        }
      } catch (error) {
        console.error('Error in waitlist check:', error);
      } finally {
        setIsLoading(false);
        setIsAddingToWaitlist(false);
      }
    };

    checkAndAddToWaitlist();
  }, [user, profile]);

  const [position, setPosition] = useState<number | null>(null);

  useEffect(() => {
    const getWaitlistPosition = async () => {
      if (!waitlistEntry || !user) return;
      
      try {
        // Count entries before this one (signed up earlier)
        const { count, error } = await supabase
          .from('waitlist')
          .select('*', { count: 'exact', head: true })
          .lt('signed_up_at', waitlistEntry.signed_up_at);
        
        if (error) {
          console.error('Error getting position:', error);
          return;
        }
        
        setPosition((count || 0) + 1);
      } catch (error) {
        console.error('Error getting position:', error);
      }
    };

    if (waitlistEntry) {
      getWaitlistPosition();
    }
  }, [waitlistEntry, user]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navigation />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4 py-12">
        <div className="max-w-2xl w-full">
          <Card className="border-2 border-gray-200 shadow-xl">
            <CardContent className="p-8 md:p-12">
              <div className="text-center space-y-6">
                {/* Icon */}
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-polyform-green-500 to-polyform-green-600 rounded-full flex items-center justify-center shadow-lg">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                </div>

                {/* Heading */}
                <div className="space-y-2">
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                    Coming Soon!
                  </h1>
                  <p className="text-xl text-gray-600">
                    We're putting the finishing touches on something amazing
                  </p>
                </div>

                {/* Success Message */}
                {waitlistEntry && (
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 space-y-4">
                    <div className="flex items-center justify-center gap-2 text-green-700">
                      <CheckCircle2 className="w-6 h-6" />
                      <span className="font-semibold text-lg">
                        You're on the waitlist!
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-left bg-white rounded-md p-4">
                      <div className="flex items-center gap-3 text-gray-700">
                        <Mail className="w-5 h-5 text-gray-500" />
                        <span className="font-medium">Email:</span>
                        <span>{user?.email}</span>
                      </div>
                      
                      {position && (
                        <div className="flex items-center gap-3 text-gray-700">
                          <Clock className="w-5 h-5 text-gray-500" />
                          <span className="font-medium">Position:</span>
                          <span className="font-semibold text-polyform-green-600">
                            #{position}
                          </span>
                        </div>
                      )}
                    </div>

                    <p className="text-green-800 text-sm">
                      We'll notify you as soon as we launch. Get ready for an amazing experience!
                    </p>
                  </div>
                )}

                {/* Loading State */}
                {(isLoading || isAddingToWaitlist) && (
                  <div className="text-gray-600">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-polyform-green-600"></div>
                    <p className="mt-2">Adding you to the waitlist...</p>
                  </div>
                )}

                {/* Info Section */}
                <div className="pt-6 border-t border-gray-200 space-y-4">
                  <p className="text-gray-600">
                    PolyForm Print Studio is launching soon with revolutionary 3D printing solutions.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                    <div>
                      <div className="font-semibold text-gray-700 mb-1">Fast Production</div>
                      <div>Quick turnaround times</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-700 mb-1">Quality Materials</div>
                      <div>Premium 3D printing materials</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-700 mb-1">Expert Support</div>
                      <div>Dedicated customer service</div>
                    </div>
                  </div>
                </div>

                {/* Sign Out Button */}
                <div className="pt-6">
                  <Button
                    variant="outline"
                    onClick={async () => {
                      await supabase.auth.signOut();
                      window.location.href = '/';
                    }}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ComingSoon;

