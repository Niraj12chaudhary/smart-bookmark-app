# Smart Bookmark App

A production-grade bookmark management application built with Next.js 14, Supabase, and Tailwind CSS.

## Features

- **Google OAuth Authentication** - Secure login using Google accounts only
- **Real-time Updates** - Bookmarks sync across multiple browser tabs instantly
- **Row Level Security (RLS)** - Users can only access their own bookmarks
- **Modern UI** - Clean, responsive design with Tailwind CSS
- **Type Safety** - Full TypeScript support with database types

## Architecture

### Tech Stack
- **Frontend**: Next.js 14 (App Router)
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

### Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/callback/      # OAuth callback handler
│   ├── login/             # Login page
│   └── page.tsx           # Main dashboard
├── components/            # React components
│   ├── BookmarkForm.tsx   # Add bookmark form
│   ├── BookmarkList.tsx   # Bookmark list with real-time updates
│   └── SignOutButton.tsx  # Sign out functionality
├── lib/                   # Utility libraries
│   ├── auth.ts           # Authentication helpers
│   ├── supabase.ts       # Client-side Supabase client
│   └── supabase/
│       └── server.ts     # Server-side Supabase client
└── types/
    └── database.ts        # TypeScript database types
```

## Row Level Security (RLS)

RLS is enabled on the `bookmarks` table to ensure data isolation between users:

### Policies Implemented:
1. **SELECT Policy**: Users can only read their own bookmarks
   ```sql
   CREATE POLICY "Users can select their own bookmarks" ON bookmarks
     FOR SELECT USING (auth.uid() = user_id);
   ```

2. **INSERT Policy**: Users can only insert bookmarks with their own user_id
   ```sql
   CREATE POLICY "Users can insert their own bookmarks" ON bookmarks
     FOR INSERT WITH CHECK (auth.uid() = user_id);
   ```

3. **DELETE Policy**: Users can only delete their own bookmarks
   ```sql
   CREATE POLICY "Users can delete their own bookmarks" ON bookmarks
     FOR DELETE USING (auth.uid() = user_id);
   ```

4. **UPDATE Policy**: Users can only update their own bookmarks
   ```sql
   CREATE POLICY "Users can update their own bookmarks" ON bookmarks
     FOR UPDATE USING (auth.uid() = user_id);
   ```

## Real-time Functionality

The app uses Supabase Realtime to provide instant updates across multiple browser tabs:

```typescript
const channel = supabase
  .channel('bookmarks')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'bookmarks'
    },
    (payload) => {
      // Refresh bookmarks when any change occurs
      fetchBookmarks()
    }
  )
  .subscribe()
```

When a user adds or deletes a bookmark, all open tabs automatically update without requiring a page refresh.

## Setup Instructions

### 1. Clone and Install Dependencies
```bash
git clone <your-repo-url>
cd smart-bookmark-app
npm install
```

### 2. Set up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to Authentication → Providers and enable Google OAuth
3. Add your redirect URL: `https://your-domain.vercel.app/auth/callback`
4. Run the SQL schema from `database/schema.sql` in the Supabase SQL Editor

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

Get these values from your Supabase project settings:
- URL: Project Settings → API → Project URL
- Anon Key: Project Settings → API → anon public
- Service Role Key: Project Settings → API → service_role (keep this secret!)

### 4. Run Locally
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

### Step-by-Step Instructions:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect it's a Next.js project

3. **Configure Environment Variables**
   In Vercel dashboard → Settings → Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

4. **Update Supabase Redirect URL**
   In Supabase dashboard → Authentication → URL Configuration:
   - Add your Vercel URL: `https://your-app.vercel.app/auth/callback`

5. **Deploy**
   - Click "Deploy" in Vercel
   - Your app will be live at the provided Vercel URL

### Required Environment Variables for Vercel:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## Problems Faced and Solutions

### 1. Next.js 15 Cookies API Changes
**Problem**: The `cookies()` function in Next.js 15 returns a Promise, causing TypeScript errors.
**Solution**: Made the `createClient()` function async and properly awaited the cookies() call.

### 2. Supabase Client Configuration
**Problem**: Initial attempts to configure cookie handling in server components caused type errors.
**Solution**: Simplified the server client configuration and disabled session persistence for server-side operations.

### 3. Real-time Subscription Cleanup
**Problem**: Real-time subscriptions could cause memory leaks if not properly cleaned up.
**Solution**: Added proper cleanup in useEffect return function to remove Supabase channels.

### 4. Environment Variable Security
**Problem**: Risk of committing sensitive API keys to version control.
**Solution**: Used `.env.local` (gitignored) and provided `.env.local.example` as a template.

### 5. Authentication Flow
**Problem**: Handling OAuth callback and redirect flow properly.
**Solution**: Created dedicated callback route that exchanges the auth code and redirects appropriately.

## Database Schema

The complete SQL schema is available in `database/schema.sql`. Key points:

- `bookmarks` table with UUID primary key
- Foreign key relationship with `auth.users`
- Row Level Security enabled
- Realtime publication enabled
- Proper indexing on `user_id` for performance

## Development Notes

- Server components are used for authentication checks
- Client components are only used where interactivity is required (forms, real-time)
- TypeScript types are generated from the database schema
- Error handling is implemented throughout the application
- Loading states provide better user experience

## License

MIT License - feel free to use this project as a template or reference.
