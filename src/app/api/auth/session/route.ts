
import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';
import { admin } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  console.log('API: /api/auth/session POST endpoint hit.');
  const {idToken} = await request.json();

  if (!idToken) {
    console.error('API: No idToken provided in request.');
    return NextResponse.json({error: 'idToken is required'}, {status: 400});
  }
  
  // Set session expiration to 5 days.
  const expiresIn = 60 * 60 * 24 * 5 * 1000;

  try {
    console.log('API: Attempting to create session cookie.');
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });
    const response = NextResponse.json({status: 'success'}, {status: 200});

    response.cookies.set({
      name: 'session',
      value: sessionCookie,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: expiresIn,
      path: '/',
    });

    console.log('API: Session cookie created and set successfully.');
    return response;
  } catch (error) {
    console.error('API: Error creating session cookie:', error);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 401 });
  }
}

export async function DELETE() {
  console.log('API: /api/auth/session DELETE endpoint hit. Clearing cookie.');
  const response = NextResponse.json({status: 'success'}, {status: 200});
  response.cookies.delete('session');
  return response;
}
