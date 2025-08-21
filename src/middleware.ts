
import { NextResponse, type NextRequest } from 'next/server';
import { auth } from 'firebase-admin';
import { admin } from '@/lib/firebase-admin'; // Ensure admin is initialized

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const idToken = request.cookies.get('firebaseIdToken')?.value;

  // Allow access to auth pages, api routes, and static files
  if (pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname.startsWith('/api')) {
     // If the user is logged in and tries to access login/signup, redirect them to the home page
     if (idToken) {
        try {
            await admin.auth().verifyIdToken(idToken);
            if (pathname.startsWith('/login') || pathname.startsWith('/signup')) {
              return NextResponse.redirect(new URL('/', request.url));
            }
        } catch (error) {
            // Token is invalid, let them proceed to login/signup
        }
     }
    return NextResponse.next();
  }
  
  // If there's no token, redirect to login
  if (!idToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname); // You can optionally redirect back after login
    return NextResponse.redirect(loginUrl);
  }

  // Verify the token
  try {
    await admin.auth().verifyIdToken(idToken);
    // Token is valid, allow access
    return NextResponse.next();
  } catch (error) {
    // Token is invalid, redirect to login and clear the bad cookie
    const loginUrl = new URL('/login', request.url);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete('firebaseIdToken');
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - /api/auth/session (our session handling api)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/auth/session).*)',
  ],
};
