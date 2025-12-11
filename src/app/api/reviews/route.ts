import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendReviewNotificationEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { providerId, reviewerName, reviewerEmail, rating, reviewText } = body;

    // Validate required fields
    if (!providerId || !reviewerName || !reviewerEmail || !rating) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const supabase = createClient();
    
    // Get provider details
    const { data: provider } = await supabase
      .from('providers')
      .select('email, first_name, last_name')
      .eq('id', providerId)
      .single();
    
    // Insert review
    const { data, error } = await supabase
      .from('provider_reviews')
      .insert({
        provider_id: providerId,
        reviewer_name: reviewerName,
        reviewer_email: reviewerEmail,
        rating: rating,
        review_text: reviewText || null,
        is_verified: false,
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting review:', error);
      return NextResponse.json(
        { error: 'Failed to submit review' },
        { status: 500 }
      );
    }

    // Send email notification to provider
    if (provider) {
      await sendReviewNotificationEmail({
        providerName: `${provider.first_name} ${provider.last_name}`,
        providerEmail: provider.email,
        reviewerName,
        rating,
        reviewText,
      }).catch(err => console.error('Failed to send review notification:', err));
    }

    return NextResponse.json({ 
      success: true,
      review: data
    });
  } catch (error) {
    console.error('Error submitting review:', error);
    return NextResponse.json(
      { error: 'Failed to submit review' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const providerId = searchParams.get('providerId');

    if (!providerId) {
      return NextResponse.json(
        { error: 'Provider ID is required' },
        { status: 400 }
      );
    }

    const supabase = createClient();
    
    // Get reviews
    const { data: reviews, error: reviewsError } = await supabase
      .from('provider_reviews')
      .select('*')
      .eq('provider_id', providerId)
      .order('created_at', { ascending: false });

    if (reviewsError) {
      console.error('Error fetching reviews:', reviewsError);
      return NextResponse.json(
        { error: 'Failed to fetch reviews' },
        { status: 500 }
      );
    }

    // Get rating summary
    const { data: ratingSummary, error: summaryError } = await supabase
      .from('provider_ratings')
      .select('*')
      .eq('provider_id', providerId)
      .single();

    return NextResponse.json({ 
      reviews: reviews || [],
      summary: ratingSummary || {
        review_count: 0,
        average_rating: 0,
        five_star_count: 0,
        four_star_count: 0,
        three_star_count: 0,
        two_star_count: 0,
        one_star_count: 0,
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
