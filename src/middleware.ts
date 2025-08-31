import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAuthenticated = request.cookies.has('admin-auth')
 
  // Allow requests to the login page to proceed regardless of authentication.
  if (pathname.startsWith('/admin/login')) {
    return NextResponse.next()
  }
 
  // If user is not authenticated and trying to access any other admin page,
  // redirect them to the login page.
  if (!isAuthenticated && pathname.startsWith('/admin')) {
    const loginUrl = new URL('/admin/login', request.url)
    return NextResponse.redirect(loginUrl)
  }
 
  return NextResponse.next()
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: '/admin/:path*',
}
