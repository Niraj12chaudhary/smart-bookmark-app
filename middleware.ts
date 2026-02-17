import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value)
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    const { pathname } = request.nextUrl

    // Skip auth checks for these paths
    if (
      pathname.startsWith('/auth') ||
      pathname.startsWith('/_next') ||
      pathname === '/favicon.ico'
    ) {
      return response
    }

    // Redirect to login if no user
    if (!user && pathname !== '/login') {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Redirect to home if logged in
    if (user && pathname === '/login') {
      return NextResponse.redirect(new URL('/', request.url))
    }

  } catch (error) {
    console.error('Middleware error:', error)
    // If auth fails, allow request to continue (let page handle auth)
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}