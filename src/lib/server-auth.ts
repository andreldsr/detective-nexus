
'use server';

import { cookies } from 'next/headers';
import { admin } from './firebase-admin';
import type { User } from 'firebase/auth';

export async function getCurrentUser(): Promise<User | null> {
  const sessionCookie = (await cookies()).get('session')?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const decodedToken = await admin.auth().verifySessionCookie(sessionCookie, true);
    
    // The decoded token has all the user info you need.
    // The `User` type from 'firebase/auth' is technically for the client SDK,
    // but the structure is compatible enough for our purposes here.
    return decodedToken as unknown as User;

  } catch (error) {
    console.error('Error verifying auth token:', error);
    // Clear the invalid cookie
    cookies().delete('session');
    return null;
  }
}
