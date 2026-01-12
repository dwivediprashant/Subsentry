import { clerkMiddleware } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

const publicRoutes = ['/sign-in', '/sign-up', '/']
const authRoutes = ['/sign-in', '/sign-up']

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId } = await auth()
  const path = req.nextUrl.pathname

  // not authenticated
  if (!userId && !publicRoutes.includes(path)) {
    (await auth()).redirectToSignIn();
  }

  // authenticated user visiting auth pages
  if (userId && authRoutes.includes(path)) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!_next|.*\\..*).*)',
  ],
}
