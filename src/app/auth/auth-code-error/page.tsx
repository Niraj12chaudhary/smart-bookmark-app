'use client'

import { useRouter } from 'next/navigation'

export default function AuthCodeErrorPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Authentication Error
          </h1>
          <p className="text-gray-600 mb-8">
            There was an issue with the authentication process. Please try again.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  )
}
