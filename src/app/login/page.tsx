'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'  // ← Changed this
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleGoogleLogin = async () => {
    setLoading(true)
    
    const supabase = createClient()  // ← Create client here
    
    console.log('Starting Google OAuth flow...')
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    console.log('OAuth response:', { data, error })

    if (error) {
      console.error('Error logging in with Google:', error)
      setLoading(false)
    }
    // Don't setLoading(false) on success - redirect will happen
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to Smart Bookmark App
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Use your Google account to access your bookmarks
          </p>
        </div>
        <div>
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </button>
        </div>
      </div>
    </div>
  )
}
