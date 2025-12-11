'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContactProviderModal } from '@/components/ContactProviderModal';

interface ContactButtonProps {
  providerId: string;
  providerName: string;
  providerEmail: string;
  providerFirstName: string;
}

export function ContactButton({ 
  providerId, 
  providerName, 
  providerEmail,
  providerFirstName 
}: ContactButtonProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button 
        leftIcon={<Mail className="h-4 w-4" />}
        onClick={() => setShowModal(true)}
      >
        Contact {providerFirstName}
      </Button>
      
      <ContactProviderModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        providerId={providerId}
        providerName={providerName}
        providerEmail={providerEmail}
      />
    </>
  );
}
