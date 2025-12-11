'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Star, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  providerId: string;
  providerName: string;
  onReviewSubmitted?: () => void;
}

export function ReviewModal({
  isOpen,
  onClose,
  providerId,
  providerName,
  onReviewSubmitted,
}: ReviewModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerId,
          reviewerName: name,
          reviewerEmail: email,
          rating,
          reviewText,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setName('');
        setEmail('');
        setRating(0);
        setReviewText('');
        if (onReviewSubmitted) {
          onReviewSubmitted();
        }
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl">
        {success ? (
          <div className="p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 shadow-lg">
              <CheckCircle2 className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">Review Submitted!</h3>
            <p className="text-neutral-600">
              Thank you for sharing your experience.
            </p>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-r from-amber-500 to-yellow-500 px-6 py-5 rounded-t-2xl">
              <h2 className="text-xl font-semibold text-white">
                Review {providerName}
              </h2>
              <p className="mt-1 text-sm text-amber-50">
                Share your experience with {providerName}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">

              {error && (
                <div className="rounded-lg bg-error-50 border border-error-200 p-3 text-sm text-error-700">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Your Rating *
                </label>
                <div className="flex gap-2 justify-center py-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-lg p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={cn(
                          'h-10 w-10 transition-all duration-200',
                          (hoverRating || rating) >= star
                            ? 'fill-amber-400 text-amber-400 drop-shadow-lg'
                            : 'fill-none text-neutral-300'
                        )}
                      />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="mt-2 text-center text-sm font-medium text-amber-600">
                    {rating === 5 ? '⭐ Excellent!' : rating === 4 ? '👍 Good' : rating === 3 ? '👌 Average' : rating === 2 ? '😐 Fair' : '👎 Poor'}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="reviewName" className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Your Name *
                </label>
                <input
                  id="reviewName"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="block h-11 w-full rounded-lg border border-neutral-300 px-3.5 text-base placeholder:text-neutral-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="reviewEmail" className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Your Email *
                </label>
                <input
                  id="reviewEmail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  required
                  className="block h-11 w-full rounded-lg border border-neutral-300 px-3.5 text-base placeholder:text-neutral-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="reviewText" className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Your Review (optional)
                </label>
                <textarea
                  id="reviewText"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share details about your experience..."
                  rows={4}
                  className="block w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-base placeholder:text-neutral-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200 transition-colors resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </Modal>
  );
}
