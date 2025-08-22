
'use server';

import { cookies } from 'next/headers';
import { admin } from './firebase-admin';
import type { User } from 'firebase/auth';

export async function getCurrentUser(): Promise<User | null> {
  const sessionCookie = (await cookies()).get('session')?.value;
  console.log('Server-Auth: Checking for session cookie. Found:', !!sessionCookie);

  if (!sessionCookie) {
    return null;
  }

  try {
    console.log('Server-Auth: Verifying session cookie...');
    const decodedToken = await admin.auth().verifySessionCookie(sessionCookie, true);
    console.log('Server-Auth: Session cookie verified successfully for UID:', decodedToken.uid);
    
    // The decoded token has all the user info you need.
    // The `User` type from 'firebase/auth' is technically for the client SDK,
    // but the structure is compatible enough for our purposes here.
    return decodedToken as unknown as User;

  } catch (error) {
    console.error('Server-Auth: Error verifying auth token:', error);
    // Clear the invalid cookie
    console.log('Server-Auth: Deleting invalid session cookie.');
    cookies().delete('session');
    return null;
  }
}
