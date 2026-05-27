# Deployment Environment Setup Guide

## Issue Summary

CORS errors occur because environment variables aren't configured on the deployed services:

- **Backend (Render)** - Missing FRONTEND_URL and other environment variables
- **Frontend (Vercel)** - Missing VITE_GOOGLE_CLIENT_ID

---

## 🔧 Backend Setup (Render)

### Step 1: Access Render Dashboard

1. Go to [render.com](https://render.com)
2. Log in and find your `campushub-1` service
3. Click on the service → **Environment** tab

### Step 2: Add Environment Variables

Click **"Add Environment Variable"** and add these:

| Variable                | Value                                                                                                                               |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `PORT`                  | `5000`                                                                                                                              |
| `NODE_ENV`              | `production`                                                                                                                        |
| `MONGO_URI`             | `mongodb+srv://campushub:CampusHub%40123@clusters0.wa0zsnr.mongodb.net/campusconnect?retryWrites=true&w=majority&appName=Clusters0` |
| `JWT_SECRET`            | `a49c75f4509343a14b6051836f0de286ceb7a41f549438489de8d7da97e025d4`                                                                  |
| `JWT_EXPIRE`            | `7d`                                                                                                                                |
| `EMAIL_HOST`            | `smtp.gmail.com`                                                                                                                    |
| `EMAIL_PORT`            | `587`                                                                                                                               |
| `EMAIL_SECURE`          | `false`                                                                                                                             |
| `EMAIL_USER`            | `24985a4437@raghuenggcollege.in`                                                                                                    |
| `EMAIL_PASSWORD`        | `wadzpxholvjuwtgz`                                                                                                                  |
| `CLOUDINARY_CLOUD_NAME` | `dlpkphwox`                                                                                                                         |
| `CLOUDINARY_API_KEY`    | `823423922284278`                                                                                                                   |
| `CLOUDINARY_API_SECRET` | `bZUN8tz5LVXj4QtxJ4Wce588Na0`                                                                                                       |
| `FRONTEND_URL`          | `https://campus-1-pink.vercel.app`                                                                                                  |
| `GOOGLE_CLIENT_ID`      | `1076774871185-3bsp0vhfg87aboo1ragqrtcttc6j3epg.apps.googleusercontent.com`                                                         |
| `GOOGLE_CLIENT_SECRET`  | `GOCSPX-OnyHuhKwrJ1i_CVQVN9ohkmwXwY`                                                                                                |
| `GOOGLE_CALLBACK_URL`   | `https://campushub-1-jjze.onrender.com/api/auth/google/callback`                                                                    |
| `SESSION_SECRET`        | `campusconnect-session-secret-key-2026`                                                                                             |

### Step 3: Deploy

After adding all variables:

1. Click **"Save Changes"**
2. The service will automatically redeploy
3. Wait for deployment to complete (check the "Events" tab)

---

## 🌐 Frontend Setup (Vercel)

### Step 1: Access Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Find your `campus-1` project
3. Go to **Settings** → **Environment Variables**

### Step 2: Add Environment Variables

Add these environment variables:

| Variable                | Value                                                                       |
| ----------------------- | --------------------------------------------------------------------------- |
| `VITE_GOOGLE_CLIENT_ID` | `1076774871185-3bsp0vhfg87aboo1ragqrtcttc6j3epg.apps.googleusercontent.com` |
| `VITE_API_URL`          | `https://campushub-1-jjze.onrender.com`                                     |

**Important**: Make sure these are available in **Production** and **Preview** environments.

### Step 3: Redeploy

1. After adding variables, you need to redeploy
2. Go to **Deployments** tab
3. Click **"Redeploy"** on the latest deployment
4. Wait for build to complete

---

## ✅ Testing

### Test Backend CORS

```bash
# From your browser console on https://campus-1-pink.vercel.app
curl -i -X GET 'https://campushub-1-jjze.onrender.com/api/health' \
  -H 'Origin: https://campus-1-pink.vercel.app'
```

Should return a successful response.

### Test Frontend Google Login

1. Go to https://campus-1-pink.vercel.app/login
2. The Google Sign-In button should render without errors
3. Try to log in with Google

---

## 🐛 Troubleshooting

### Still getting CORS errors?

1. Clear browser cache and cookies
2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Check that Render service has redeployed after adding environment variables

### Google button still not showing?

1. Verify `VITE_GOOGLE_CLIENT_ID` is set in Vercel dashboard
2. Trigger a new deployment in Vercel (even if code hasn't changed)
3. Wait 2-3 minutes for Vercel to rebuild

### Authentication fails?

1. Check browser console for CORS errors
2. Check Render service logs: **Logs** tab in Render dashboard
3. Verify all environment variables match the table above

---

## 📝 Local Development

For local development, use the `.env.local` files already created:

### Backend: `backend/.env`

Already configured for local development

### Frontend: `frontend/.env.local`

```
VITE_GOOGLE_CLIENT_ID=1076774871185-3bsp0vhfg87aboo1ragqrtcttc6j3epg.apps.googleusercontent.com
VITE_API_URL=http://localhost:5000
```

---

## 🔐 Security Note

⚠️ **Never commit `.env` files to Git!** The files already added to `.gitignore` should prevent this, but verify:

- `backend/.env` should NOT be in git
- `frontend/.env.local` should NOT be in git

All secrets should only exist in:

- Render environment variables
- Vercel environment variables
- Local `.env` files (not committed)
