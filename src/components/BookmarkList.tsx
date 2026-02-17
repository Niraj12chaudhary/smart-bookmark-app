'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Bookmark } from '@/types/database'
import { useAuth } from '@/contexts/AuthContext'

interface BookmarkListProps {
  refreshTrigger: number
}

export default function BookmarkList({ refreshTrigger }: BookmarkListProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const supabase = createClient()

  const fetchBookmarks = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')

    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      setError('Failed to fetch bookmarks')
      console.error('Error fetching bookmarks:', error)
    } else {
      setBookmarks(data || [])
    }

    setLoading(false)
  }

  const deleteBookmark = async (id: string) => {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting bookmark:', error)
    } else {
      setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id))
    }
  }

  useEffect(() => {
    if (user) {
      fetchBookmarks()
    }
  }, [refreshTrigger, user])

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel(`user_bookmarks_${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${user.id}`
        },
        (payload: any) => {
          if (payload.eventType === 'INSERT' && payload.new) {
            setBookmarks(prev => [payload.new, ...prev])
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${user.id}`
        },
        (payload: any) => {
          if (payload.eventType === 'DELETE' && payload.old) {
            setBookmarks(prev => prev.filter(bookmark => bookmark.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <div className="text-gray-500">Loading bookmarks...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      </div>
    )
  }

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookmarks yet</h3>
          <p className="text-gray-500">Add your first bookmark above to get started!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Bookmarks</h2>
      <div className="grid gap-4">
        {bookmarks.map((bookmark, index) => (
          <div
            key={bookmark.id}
            className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.01] animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0 pr-4">
                <h3 className="text-lg font-medium text-gray-900 truncate mb-1">
                  {bookmark.title}
                </h3>
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline truncate block transition-colors duration-200"
                >
                  {bookmark.url}
                </a>
                <p className="text-xs text-gray-500 mt-2">
                  Added {new Date(bookmark.created_at).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <button
                onClick={() => deleteBookmark(bookmark.id)}
                className="flex-shrink-0 px-3 py-1 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-all duration-200 transform hover:scale-105"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
