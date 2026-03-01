import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth((req: NextRequest & { auth: any }) => {
  const { nextUrl } = req;

  // Define sensitive routes that should never be cached
  const isSensitiveRoute = 
    nextUrl.pathname.startsWith('/admin') || 
    nextUrl.pathname.startsWith('/profile') || 
    nextUrl.pathname.startsWith('/orders') ||
    nextUrl.pathname.startsWith('/favorites') ||
    nextUrl.pathname.startsWith('/cart');

  const response = NextResponse.next();

  // If it's a sensitive route, add Cache-Control headers to prevent "Back Button" history leaks
  if (isSensitiveRoute) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }

  return response;
});

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\.png$).*)'],
};
