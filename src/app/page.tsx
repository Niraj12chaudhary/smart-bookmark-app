
import { requireAuth } from '@/lib/auth'
import BookmarkFormWrapper from '@/components/BookmarkFormWrapper'
import BookmarkListWrapper from '@/components/BookmarkListWrapper'
import SignOutButton from '@/components/SignOutButton'
import { AuthProvider } from '@/contexts/AuthContext'
import { BookmarkProvider } from '@/contexts/BookmarkContext'
// import AuthDebug from '@/components/AuthDebug'
// import RealtimeDebug from '@/components/RealtimeDebug'

export default async function HomePage() {
  await requireAuth()

  return (
    <AuthProvider>
      <BookmarkProvider>
        <main className="min-h-screen bg-gray-50">
          <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Smart Bookmark App</h1>
              <SignOutButton />
            </div>
            
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Bookmark</h2>
                  <BookmarkFormWrapper />
                </div>
              </div>
              
              <div>
                <BookmarkListWrapper />
              </div>
            </div>
          </div>
        </main>
        {/* <AuthDebug /> */}
        {/* <RealtimeDebug /> */}
      </BookmarkProvider>
    </AuthProvider>
  )
}
