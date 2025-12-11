import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Admin password - Change this to your secure password
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin123!';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    // Check if password matches
    if (password === ADMIN_PASSWORD) {
      // Generate a session token
      const sessionToken = crypto.randomBytes(32).toString('hex');
      
      // In a real app, you'd store this in a database with expiration
      // For now, we'll just return it
      
      return NextResponse.json({ 
        success: true,
        sessionToken,
        message: 'Authentication successful'
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
