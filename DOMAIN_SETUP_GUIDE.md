# Domain Setup Guide for Supabase Authentication

## 🎯 Goal
Change the Google OAuth consent screen from:
```
Choose an account to continue to wutxwjkeejpwxjnftagz.supabase.co
```

To something more meaningful like:
```
Choose an account to continue to smart-bookmark-app.supabase.co
```

## 🔧 Option 1: Configure Custom Domain (Recommended)

### Step 1: Supabase Dashboard Configuration
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Project Settings** → **Authentication**
4. Under **URL Configuration**, set:
   - **Site URL**: `https://your-domain.com`
   - **Redirect URLs**: `https://your-domain.com/auth/v1/callback`

### Step 2: Google Cloud Console Configuration
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Find your OAuth 2.0 Client ID
4. Under **Authorized redirect URIs**, add:
   - `https://your-domain.com/auth/v1/callback`

### Step 3: Update Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 🔧 Option 2: Rename Supabase Project

### Step 1: Project Renaming
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your current project
3. Click **Settings** → **General**
4. Change **Project Name** to `smart-bookmark-app`
5. Save changes

### Step 2: Update References
Update any documentation or README files with the new project name.

## 🔧 Option 3: Google OAuth Display Name Only

### Step 1: Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Find your OAuth 2.0 Client ID
4. Click to edit the client

### Step 2: Update Application Details
Change these fields:
- **Application name**: `Smart Bookmark App`
- **Application logo**: Upload your app logo
- **Application homepage link**: `https://your-domain.com`
- **Authorized domains**: Add your custom domain
- **Developer contact information**: Your email

## 🌐 Custom Domain Requirements

If using a custom domain, ensure:
- **DNS**: Proper A/AAAA records pointing to your server
- **SSL**: Valid SSL certificate
- **CORS**: Domain is accessible from your app

## 📱 Testing After Changes

1. **Clear Browser Data**: Remove old authentication cookies
2. **Test Login**: Try the Google login flow
3. **Verify Redirect**: Ensure you're redirected to the correct domain
4. **Check Consent Screen**: Verify the new display name appears

## ⚠️ Important Notes

- **Reference ID**: The Supabase reference ID (`wutxwjkeejpwxjnftagz`) might not change even after renaming
- **Propagation**: DNS and SSL changes can take time to propagate
- **Testing**: Always test in incognito mode to verify changes
- **Security**: Never expose sensitive credentials in client-side code

## 🎨 Branding Recommendations

For a professional appearance:
- **Consistent Naming**: Use the same app name across all platforms
- **Professional Domain**: Use a domain that represents your brand
- **Custom Logo**: Add your app logo to the OAuth consent screen
- **Clear Description**: Add app description to help users understand the purpose

## 🔄 Migration Checklist

- [ ] Update Supabase project settings
- [ ] Configure Google Cloud Console
- [ ] Update environment variables
- [ ] Test authentication flow
- [ ] Update documentation
- [ ] Deploy with new configuration
