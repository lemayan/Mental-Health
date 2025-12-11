'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ReviewModal } from '@/components/ReviewModal';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Review {
  id: string;
  reviewer_name: string;
  rating: number;
  review_text?: string;
  created_at: string;
}

interface RatingSummary {
  review_count: number;
  average_rating: number;
  five_star_count: number;
  four_star_count: number;
  three_star_count: number;
  two_star_count: number;
  one_star_count: number;
}

interface ReviewsSectionProps {
  providerId: string;
  providerName: string;
}

export function ReviewsSection({ providerId, providerName }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<RatingSummary>({
    review_count: 0,
    average_rating: 0,
    five_star_count: 0,
    four_star_count: 0,
    three_star_count: 0,
    two_star_count: 0,
    one_star_count: 0,
  });
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews?providerId=${providerId}`);
      const data = await response.json();
      setReviews(data.reviews || []);
      setSummary(data.summary || summary);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [providerId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'h-3 w-3',
      md: 'h-4 w-4',
      lg: 'h-6 w-6'
    };
    
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              sizeClasses[size],
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-none text-neutral-300'
            )}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="mt-12 text-center py-4 text-neutral-600">Loading reviews...</div>;
  }

  return (
    <>
      <div className="mt-12 border-t border-neutral-200 pt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutral-900">Reviews</h2>
          <Button onClick={() => setShowReviewModal(true)} size="sm">
            Write a Review
          </Button>
        </div>

        {summary.review_count > 0 ? (
          <div className="space-y-6">
            {/* Rating Summary */}
            <div className="flex items-center gap-4 pb-6 border-b border-neutral-200">
              <div>
                <div className="text-5xl font-bold text-neutral-900">
                  {summary.average_rating.toFixed(1)}
                </div>
                <div className="mt-1 flex items-center gap-1">
                  {renderStars(Math.round(summary.average_rating), 'sm')}
                </div>
                <p className="mt-1 text-sm text-neutral-600">
                  {summary.review_count} {summary.review_count === 1 ? 'review' : 'reviews'}
                </p>
              </div>

              {/* Star Distribution */}
              <div className="flex-1 max-w-xs space-y-1">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = summary[`${['five', 'four', 'three', 'two', 'one'][5 - stars]}_star_count` as keyof RatingSummary] as number;
                  const percentage = summary.review_count > 0 ? (count / summary.review_count) * 100 : 0;
                  
                  return (
                    <div key={stars} className="flex items-center gap-2 text-sm">
                      <span className="text-neutral-600 w-8">{stars}</span>
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-yellow-400"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-neutral-600 w-8 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Individual Reviews */}
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="pb-6 border-b border-neutral-200 last:border-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <p className="font-semibold text-neutral-900">{review.reviewer_name}</p>
                      <p className="text-sm text-neutral-500">{formatDate(review.created_at)}</p>
                    </div>
                    {renderStars(review.rating)}
                  </div>
                  {review.review_text && (
                    <p className="text-neutral-700 mt-3 leading-relaxed">{review.review_text}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-neutral-50 rounded-lg">
            <p className="text-neutral-600 mb-4">No reviews yet. Be the first to review {providerName}!</p>
            <Button onClick={() => setShowReviewModal(true)}>
              Write the First Review
            </Button>
          </div>
        )}
      </div>

      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        providerId={providerId}
        providerName={providerName}
        onReviewSubmitted={fetchReviews}
      />
    </>
  );
}