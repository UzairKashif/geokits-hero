# Instagram Integration Setup Guide

## Overview

I've implemented multiple approaches to display Instagram posts directly on your site:

## Approach 1: Instagram oEmbed API (Recommended)

### Setup Steps:

1. **Create Facebook App:**
   - Go to https://developers.facebook.com/apps/
   - Create a new app
   - Add Instagram Basic Display product

2. **Get Access Token:**
   - In your app dashboard, go to Instagram Basic Display
   - Generate an access token

3. **Environment Variables:**
   ```bash
   cp .env.local.template .env.local
   ```
   
   Add your tokens to `.env.local`:
   ```
   FACEBOOK_APP_TOKEN=your_facebook_app_token_here
   INSTAGRAM_ACCESS_TOKEN=your_instagram_access_token_here
   ```

## Approach 2: Instagram Basic Display API

### Benefits:
- ✅ Display videos/reels natively
- ✅ No iframe blocking issues
- ✅ Better performance
- ✅ Custom styling
- ✅ Mobile-friendly

### Features:
- Native video playback with controls
- Image galleries for carousel posts
- Responsive grid layout
- Loading states and error handling
- Direct links to Instagram

## Usage

### Option 1: Show Recent Posts (Automatic)
```tsx
<InstagramDisplay showRecent={true} limit={6} />
```

### Option 2: Show Specific Posts
```tsx
<InstagramDisplay mediaIds={['media_id_1', 'media_id_2']} />
```

## Current Implementation

Your `CommunityEngagement.tsx` now uses:
1. **InstagramDisplay component** - Shows recent posts automatically
2. **Fallback to manual posts** - If API fails, shows your curated posts
3. **Enhanced error handling** - Graceful degradation

## API Endpoints Created:

1. `/api/instagram-embed` - For oEmbed functionality
2. `/api/instagram-media` - For Instagram Basic Display API

## Browser Compatibility:

✅ **Chrome/Safari/Edge**: Full functionality with native video playback
✅ **Firefox**: Works without tracking protection issues
✅ **Mobile**: Responsive design with touch-friendly controls

## Next Steps:

1. Set up Facebook/Instagram developer accounts
2. Add environment variables
3. Test the integration
4. Customize styling as needed

## Fallback Strategy:

If API setup is not immediate, the component will:
1. Try to load from Instagram API
2. Fall back to your curated posts
3. Show error state with direct Instagram links

This ensures your site always works, even without API configuration!
