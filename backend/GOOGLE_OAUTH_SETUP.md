# Google OAuth Setup Guide

## Setup Steps

### 1. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Choose **Web application**
6. Add Authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback` (development)
   - `https://yourdomain.com/api/auth/google/callback` (production)
7. Copy the **Client ID** and **Client Secret**

### 2. Update .env File

Add these variables to your `.env` file:

```
GOOGLE_CLIENT_ID=1076774871185-3bsp0vhfg87aboo1raqgrtcttc6j3epg.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret-here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
SESSION_SECRET=your-session-secret-key
```

### 3. Frontend Setup

Update your frontend to use the Google login URL:

```javascript
// In your login component
const handleGoogleLogin = () => {
  window.location.href = "http://localhost:5000/api/auth/google";
};
```

### 4. Test Google Login

1. Start your backend: `npm run dev`
2. Click Google login button
3. You'll be redirected to Google to authenticate
4. After successful auth, you'll receive a JWT token

## API Endpoints

- **GET** `/api/auth/google` - Initiates Google OAuth flow
- **GET** `/api/auth/google/callback` - Google OAuth callback (auto-handled)
- **GET** `/api/auth/google/failure` - Handles auth failures

## Features

✅ Auto-creates student account if email doesn't exist  
✅ Links Google account to existing student by email  
✅ Auto-verifies email for Google login  
✅ Automatically marks account as registered  
✅ Stores profile image from Google  
✅ Returns JWT token for subsequent requests

## Troubleshooting

If Google login fails:

1. Check Google Client ID and Secret in `.env`
2. Verify redirect URL matches in Google Cloud Console
3. Check browser console for CORS errors
4. Ensure `SESSION_SECRET` is set in `.env`
