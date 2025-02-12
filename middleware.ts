import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');
  
  console.log('Intercepted path:', request.nextUrl.pathname);
  
  // If no token, and the user is trying to access a restricted page (checkout, etc.), redirect to login
  if (!token && !request.nextUrl.pathname.startsWith('/login') && !request.nextUrl.pathname.startsWith('/products') && !request.nextUrl.pathname.startsWith('/')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Allow access to login, products, and homepage without authentication
  if (!token && request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.next();
  }

  if (!token && request.nextUrl.pathname.startsWith('/products')) {
    return NextResponse.next();
  }

  if (!token && request.nextUrl.pathname === '/') {
    return NextResponse.next();
  }

  // If the user is not authenticated and tries to access /checkout, redirect to /login
  if (!token && request.nextUrl.pathname.startsWith('/checkout')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }


  return NextResponse.next();
}