'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert } from '@/components/ui/alert';
import { Shield, CheckCircle2 } from 'lucide-react';

interface ContactFormProps {
  recipientType: 'provider' | 'organization';
  recipientId: string;
  recipientName: string;
  navigatorResponseId?: string;
  onSuccess?: () => void;
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export function ContactForm({
  recipientType,
  recipientId,
  recipientName,
  navigatorResponseId,
  onSuccess,
}: ContactFormProps) {
  const [formState, setFormState] = React.useState<FormState>({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [errors, setErrors] = React.useState<Partial<FormState>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormState> = {};

    if (!formState.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formState.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (formState.phone && !/^[\d\s\-\(\)\+]+$/.test(formState.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formState.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formState.message.trim().length < 10) {
      newErrors.message = 'Please write a bit more about what you\'re looking for';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        [recipientType === 'provider' ? 'provider_id' : 'organization_id']: recipientId,
        name: formState.name.trim(),
        email: formState.email.trim(),
        phone: formState.phone.trim() || undefined,
        message: formState.message.trim(),
        navigator_response_id: navigatorResponseId || undefined,
      };

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || 'Failed to send message');
      }

      setIsSuccess(true);
      onSuccess?.();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Failed to send message. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-6">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-success-100">
          <CheckCircle2 className="h-7 w-7 text-success-600" />
        </div>
        <h3 className="text-lg font-semibold text-neutral-900">Message sent!</h3>
        <p className="mt-2 text-neutral-600">
          {recipientName} will receive your message and respond to you directly at {formState.email}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {submitError && (
        <Alert variant="error" dismissible onDismiss={() => setSubmitError(null)}>
          {submitError}
        </Alert>
      )}

      <Input
        label="Your name"
        name="name"
        value={formState.name}
        onChange={handleInputChange}
        error={errors.name}
        required
        autoComplete="name"
      />

      <Input
        label="Email"
        name="email"
        type="email"
        value={formState.email}
        onChange={handleInputChange}
        error={errors.email}
        required
        autoComplete="email"
      />

      <Input
        label="Phone (optional)"
        name="phone"
        type="tel"
        value={formState.phone}
        onChange={handleInputChange}
        error={errors.phone}
        autoComplete="tel"
      />

      <Textarea
        label="Message"
        name="message"
        value={formState.message}
        onChange={handleInputChange}
        error={errors.message}
        required
        placeholder="Tell them a bit about what you're looking for..."
        rows={4}
      />

      <Button type="submit" fullWidth isLoading={isSubmitting}>
        Send message
      </Button>

      <p className="flex items-start gap-2 text-xs text-neutral-500">
        <Shield className="h-4 w-4 shrink-0 text-neutral-400" />
        Your information is only shared with {recipientName}. We don&apos;t sell or share your data.
      </p>
    </form>
  );
}
