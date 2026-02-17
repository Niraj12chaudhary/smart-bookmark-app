'use client'
import React from 'react'
import BookmarkForm from '@/components/BookmarkForm'
import { useBookmark } from '@/contexts/BookmarkContext'

export default function BookmarkFormWrapper() {
  const { triggerRefresh } = useBookmark()
  
  return <BookmarkForm onBookmarkAdded={triggerRefresh} />
}
