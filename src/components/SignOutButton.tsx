'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function SignOutButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    setLoading(true)
    
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('Error signing out:', error)
    } else {
      router.push('/login')
    }
    
    setLoading(false)
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? 'Signing out...' : 'Sign Out'}
    </button>
  )
}
