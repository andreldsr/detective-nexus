import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { admin } from '@/lib/firebase-admin';

export async function GET(_request: NextRequest) {
  try {
    const sessionCookie = cookies().get('session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const decodedToken = await admin.auth().verifySessionCookie(sessionCookie, true);
    const email = (decodedToken as any).email ?? null;
    const displayName = (decodedToken as any).name ?? null;

    return NextResponse.json(
      {
        user: {
          uid: decodedToken.uid,
          email,
          displayName,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    // If verification fails, treat as not authenticated
    try {
      cookies().delete('session');
    } catch (_) {
      // ignore
    }
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
