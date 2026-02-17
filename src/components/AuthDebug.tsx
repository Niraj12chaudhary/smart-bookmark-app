'use client'
import { useAuth } from '@/contexts/AuthContext'

export default function AuthDebug() {
  const { user, loading } = useAuth()

  // return (
  //   <div className="fixed top-4 right-4 bg-yellow-100 border border-yellow-400 p-4 rounded-lg text-xs max-w-xs z-50">
  //     <h4 className="font-bold mb-2">Auth Debug</h4>
  //     <div>Loading: {loading ? 'Yes' : 'No'}</div>
  //     <div>User: {user ? user.email : 'None'}</div>
  //     <div>User ID: {user ? user.id : 'None'}</div>
  //   </div>
  // )
}
