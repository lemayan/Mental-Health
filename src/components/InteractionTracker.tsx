'use client';

import { useEffect } from 'react';

interface InteractionTrackerProps {
  providerId: string;
}

export function InteractionTracker({ providerId }: InteractionTrackerProps) {
  useEffect(() => {
    // Track profile view
    trackInteraction('profile_view');
  }, []);

  const trackInteraction = async (interactionType: string, metadata?: any) => {
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();

      const { error } = await supabase
        .from('provider_interactions')
        .insert({
          provider_id: providerId,
          interaction_type: interactionType,
          user_agent: navigator.userAgent,
          referrer: document.referrer || null,
          metadata: metadata || null,
        });

      if (error) {
        // Silently fail if table doesn't exist yet - don't spam console
        if (!error.message.includes('does not exist')) {
          console.error('Failed to track interaction:', error);
        }
      }
    } catch (error) {
      // Silently fail for tracking errors
    }
  };

  // Attach click handlers to track email, phone, and website clicks
  useEffect(() => {
    const handleEmailClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a[href^="mailto:"]')) {
        trackInteraction('email_click');
      }
    };

    const handlePhoneClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a[href^="tel:"]')) {
        trackInteraction('phone_click');
      }
    };

    const handleWebsiteClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[data-track="website"]');
      if (link) {
        trackInteraction('website_click');
      }
    };

    document.addEventListener('click', handleEmailClick);
    document.addEventListener('click', handlePhoneClick);
    document.addEventListener('click', handleWebsiteClick);

    return () => {
      document.removeEventListener('click', handleEmailClick);
      document.removeEventListener('click', handlePhoneClick);
      document.removeEventListener('click', handleWebsiteClick);
    };
  }, [providerId]);

  return null;
}
