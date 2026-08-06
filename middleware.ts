import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the referer header from the incoming request
  const referer = request.headers.get('referer')
  
  // If there is no referer, the user typed the URL manually or opened a new tab
  if (!referer) {
    // Redirect them to the home page (or any other page you prefer)
    return NextResponse.redirect(new URL('/', request.url))
  }

  // If the referer exists (they clicked a link), allow the request to proceed
  return NextResponse.next()
}

// Specify exactly which routes this middleware should protect
export const config = {
  matcher: [
    // Add the paths you want to lock down here
    '/dashboard/:path*', 
    '/checkout/payment',
    '/secret-page'
  ],
}