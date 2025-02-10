// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// export function middleware(request: NextRequest) {
  
  
//   // Example: Redirect if not authenticated
//   const authToken = request.cookies.get('authToken');
  
//   //Check if the user is trying to access the checkout page and is not authenticated
//   if (!authToken && request.nextUrl.pathname.startsWith('/checkout')) {
//     return NextResponse.redirect(new URL('/login', request.url));
//   }

// // Allow the request to proceed if no conditions are met
//   return NextResponse.next();
// }

// //specify which routes this middleware applies to
// export const config = {
//   matcher: ['/checkout', '/login', '/signup', '/products:id'],
// };