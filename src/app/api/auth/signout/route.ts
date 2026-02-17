import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const supabase = await createClient()
    
    // Sign out from server side
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('Server sign out error:', error)
      return NextResponse.json(
        { error: 'Failed to sign out' },
        { status: 500 }
      )
    }
    
    // Create response with cleared cookies
    const response = NextResponse.json({ success: true })
    
    // Clear all auth-related cookies
    response.cookies.set('sb-access-token', '', {
      maxAge: 0,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    })
    
    response.cookies.set('sb-refresh-token', '', {
      maxAge: 0,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    })
    
    return response
    
  } catch (error) {
    console.error('Unexpected sign out error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
