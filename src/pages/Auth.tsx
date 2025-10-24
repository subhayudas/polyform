
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AuthForm from '@/components/AuthForm';
import WhatsAppButton from '@/components/WhatsAppButton';
import AIChatbot from '@/components/AIChatbot';
import { Loader2 } from 'lucide-react';

const Auth = () => {
  const { user, isLoading } = useAuth();

  console.log('Auth page - isLoading:', isLoading, 'user:', !!user);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-polyform-green-600" />
      </div>
    );
  }

  if (user) {
    console.log('User found, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <AuthForm />
      <WhatsAppButton variant="fixed" />
      <AIChatbot />
    </>
  );
};

export default Auth;
