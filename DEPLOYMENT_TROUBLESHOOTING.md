# Deployment Sign-Out Troubleshooting Guide

## 🚨 Problem: Sign Out Works on Localhost but Not in Production

### Root Causes & Solutions

## 1. **Cookie Domain Issues**

### Problem
Cookies set on localhost don't work on production domain.

### Solution
```typescript
// middleware.ts - Ensure proper cookie settings
response.cookies.set(name, value, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // ✅ Required for production
  sameSite: 'lax',
  path: '/',
  domain: process.env.NODE_ENV === 'production' ? '.yourdomain.com' : undefined
})
```

## 2. **HTTPS/HTTP Mismatch**

### Problem
Secure cookies can't be accessed over HTTP.

### Solution
- Ensure production site uses HTTPS
- Set `secure: true` for production cookies
- Use `secure: false` for development

## 3. **CORS Issues**

### Problem
API routes not accessible from different origins.

### Solution
```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: 'https://yourdomain.com' },
        ],
      },
    ]
  },
}
```

## 4. **Environment Variables**

### Problem
Wrong Supabase URL or keys in production.

### Solution
```env
# Production Environment Variables
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
```

## 5. **Middleware Configuration**

### Problem
Middleware interfering with sign-out flow.

### Solution
```typescript
// middleware.ts - Add sign-out route to skip list
if (
  pathname.startsWith('/auth') ||
  pathname.startsWith('/api/auth') || // ✅ Skip API auth routes
  pathname.startsWith('/_next') ||
  pathname === '/favicon.ico'
) {
  return response
}
```

## 🔧 **Complete Fix Implementation**

### Step 1: Update Middleware
```typescript
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth).*)'],
}
```

### Step 2: Enhanced Sign Out Component
```typescript
// SignOutButton.tsx - Dual approach
const handleSignOut = async () => {
  // 1. Server-side sign out (clears cookies)
  await fetch('/api/auth/signout', { method: 'POST' })
  
  // 2. Client-side sign out (clears local state)
  await supabase.auth.signOut()
  
  // 3. Clear all storage
  localStorage.clear()
  sessionStorage.clear()
  
  // 4. Force redirect
  window.location.href = '/login'
}
```

### Step 3: API Route for Server Sign Out
```typescript
// src/app/api/auth/signout/route.ts
export async function POST() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  
  const response = NextResponse.json({ success: true })
  
  // Clear auth cookies
  response.cookies.set('sb-access-token', '', { maxAge: 0 })
  response.cookies.set('sb-refresh-token', '', { maxAge: 0 })
  
  return response
}
```

## 🧪 **Testing Checklist**

### Before Deployment
- [ ] Test sign out on localhost
- [ ] Check console for errors
- [ ] Verify cookies are cleared
- [ ] Test redirect to login page

### After Deployment
- [ ] Clear browser cache/cookies
- [ ] Test sign out in incognito mode
- [ ] Check browser network tab for failed requests
- [ ] Verify API route is accessible
- [ ] Test on different browsers

## 🔍 **Debugging Steps**

### 1. Check Browser Console
```javascript
// Check for JavaScript errors
console.log('Current user:', await supabase.auth.getUser())
console.log('Session:', await supabase.auth.getSession())
```

### 2. Inspect Cookies
```javascript
// Check if auth cookies exist
console.log('Cookies:', document.cookie)
```

### 3. Test API Route
```bash
# Test sign-out API directly
curl -X POST https://yourdomain.com/api/auth/signout
```

### 4. Network Tab Analysis
- Look for failed `/api/auth/signout` requests
- Check response headers
- Verify CORS headers

## 🚀 **Production Deployment Tips**

### Vercel Deployment
```json
// vercel.json
{
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 10
    }
  }
}
```

### Environment Variables
- Set in Vercel dashboard
- Use `NEXT_PUBLIC_` prefix for client-side access
- Never commit `.env.local` to git

### Domain Configuration
- Ensure custom domain is properly configured
- Update Supabase auth redirect URLs
- Configure SSL certificates

## 📱 **Mobile Considerations**

### iOS Safari
- Check "Prevent Cross-Site Tracking" setting
- Test in private browsing mode
- Verify cookie consent dialogs

### Android Chrome
- Test in different Chrome versions
- Check data saver settings
- Verify incognito mode behavior

## 🆘 **Common Error Messages**

### "Failed to sign out"
- Check API route accessibility
- Verify environment variables
- Check network connectivity

### "Redirect loop"
- Check middleware configuration
- Verify auth state management
- Clear browser storage

### "CORS error"
- Update CORS headers
- Check API route configuration
- Verify domain settings

## 📞 **Support Resources**

- **Supabase Docs**: https://supabase.com/docs
- **Next.js Auth**: https://nextjs.org/docs/authentication
- **Vercel Deployment**: https://vercel.com/docs

---

**Note**: If issues persist, check the browser's Network tab for failed requests and console for JavaScript errors. The most common issue is cookie domain/scope mismatch between development and production.
