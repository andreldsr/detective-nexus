
import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';

export async function POST(request: NextRequest) {
  const {idToken} = await request.json();

  if (!idToken) {
    return NextResponse.json({error: 'idToken is required'}, {status: 400});
  }

  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
  const response = NextResponse.json({status: 'success'}, {status: 200});

  response.cookies.set({
    name: 'firebaseIdToken',
    value: idToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: expiresIn,
    path: '/',
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({status: 'success'}, {status: 200});
  response.cookies.delete('firebaseIdToken');
  return response;
}
