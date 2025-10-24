
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
  variant?: 'fixed' | 'inline' | 'outline';
  size?: 'sm' | 'default' | 'lg';
}

const WhatsAppButton = ({ 
  phoneNumber = "+1234567890", // Replace with your actual WhatsApp number
  message = "Hi! I'm interested in your 3D printing services.",
  variant = 'inline',
  size = 'default'
}: WhatsAppButtonProps) => {
  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  if (variant === 'fixed') {
    return (
      <div className="fixed bottom-20 right-6 z-50">
        <Button
          onClick={handleWhatsAppClick}
          className="bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300"
          size="icon"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  if (variant === 'outline') {
    return (
      <Button
        onClick={handleWhatsAppClick}
        variant="outline"
        className="border-white text-white hover:bg-white hover:text-green-600 gap-2"
        size={size}
      >
        <MessageCircle className="w-4 h-4" />
        Chat on WhatsApp
      </Button>
    );
  }

  return (
    <Button
      onClick={handleWhatsAppClick}
      className="bg-green-500 hover:bg-green-600 text-white gap-2"
      size={size}
    >
      <MessageCircle className="w-4 h-4" />
      Chat on WhatsApp
    </Button>
  );
};

export default WhatsAppButton;
