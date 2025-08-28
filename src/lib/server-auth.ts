
'use server';

import { cookies } from 'next/headers';
import { admin } from './firebase-admin';

export type ServerUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
};

export async function getCurrentUser(): Promise<ServerUser | null> {
  const sessionCookie = (await cookies()).get('session')?.value;
  console.log('Server-Auth: Checking for session cookie. Found:', !!sessionCookie);

  if (!sessionCookie) {
    return null;
  }

  try {
    console.log('Server-Auth: Verifying session cookie...');
    const decodedToken = await admin.auth().verifySessionCookie(sessionCookie, true);
    console.log('Server-Auth: Session cookie verified successfully for UID:', decodedToken.uid);

    // Avoid extra network call: pull fields from the decoded token
    // Firebase ID tokens typically include email and name when available
    const email = (decodedToken as any).email ?? null;
    const displayName = (decodedToken as any).name ?? null;

    return {
      uid: decodedToken.uid,
      email,
      displayName,
    };

  } catch (error) {
    console.error('Server-Auth: Error verifying auth token:', error);
    // Best effort: clear potentially invalid cookie
    try {
      cookies().delete('session');
    } catch (_) {
      // ignore in environments where mutation isn't allowed
    }
    return null;
  }
}
