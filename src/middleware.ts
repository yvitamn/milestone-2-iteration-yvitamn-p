import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Example: Redirect if not authenticated
  const isAuthenticated = request.cookies.get('authToken');
  if (!isAuthenticated && request.nextUrl.pathname.startsWith('/checkout')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}