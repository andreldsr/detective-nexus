
import { NextResponse, type NextRequest } from 'next/server';

// Middleware runs on the edge and cannot use Node.js APIs like firebase-admin.
// We will simply check for the presence of the token cookie.
// The actual verification of the token will happen in server components/actions
// that need to fetch protected data.

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const idToken = request.cookies.get('firebaseIdToken')?.value;

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');

  // If the user has a token and is trying to access a login/signup page,
  // redirect them to the home page.
  if (idToken && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If the user does not have a token and is trying to access a protected page,
  // redirect them to the login page.
  if (!idToken && !isAuthPage) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
