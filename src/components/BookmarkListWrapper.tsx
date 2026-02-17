'use client'
import React from 'react'
import BookmarkList from '@/components/BookmarkList'
import { useBookmark } from '@/contexts/BookmarkContext'

export default function BookmarkListWrapper() {
  const { refreshTrigger } = useBookmark()
  
  return <BookmarkList refreshTrigger={refreshTrigger} />
}
