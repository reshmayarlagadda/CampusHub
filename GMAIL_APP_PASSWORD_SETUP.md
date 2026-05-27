# Gmail App Password Setup Guide

## Current Issue

The email sending is failing because the Gmail app password in your `.env` file is **invalid or expired**:

```
Error: Invalid login: 535-5.7.8 Username and Password not accepted
```

## Solution: Generate a New Gmail App Password

### Step 1: Enable 2-Factor Authentication (if not already enabled)

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. On the left sidebar, click **Security**
3. Scroll down to **How you sign in to Google**
4. Click **2-Step Verification**
5. Follow the on-screen prompts to enable 2FA (you'll need your phone)

### Step 2: Generate an App Password

1. Go to [Google Account Security](https://myaccount.google.com/security) again
2. Click **Security** on the left
3. Scroll down to **How you sign in to Google**
4. Look for **App passwords** (this only appears if 2FA is enabled)
5. Select **Mail** and **Windows Computer** from the dropdowns
6. Google will generate a 16-character password
7. Copy the generated password (without spaces)

### Step 3: Update Your `.env` File

Replace the `EMAIL_PASSWORD` value with the new 16-character password:

**Before:**

```
EMAIL_PASSWORD=seonpprqudtgzkzh
```

**After:**

```
EMAIL_PASSWORD=your_new_16_character_password_here
```

⚠️ **Important:** Do NOT include spaces in the password. If Google showed spaces (like `xxxx xxxx xxxx xxxx`), remove them.

### Step 4: Restart the Backend Server

After updating the `.env` file:

1. Stop the running backend server (Ctrl+C)
2. Start it again with: `npm start`
3. Check the console - you should see: ✅ Email service connected successfully

## Troubleshooting

### If you still see "Username and Password not accepted"

1. **Verify the exact email**: Check that `EMAIL_USER` in `.env` matches the Gmail account where you generated the app password
2. **Check for spaces**: Ensure there are NO spaces in the `EMAIL_PASSWORD`
3. **Regenerate the password**: Go back to Google Account and generate a new one (old ones become invalid)
4. **Check Gmail recovery email**: Make sure your recovery email is up to date

### If the error mentions "Less secure apps"

Gmail requires App Passwords for accounts with 2FA enabled. If you can't generate an app password:

- Ensure 2FA is properly enabled
- Go to [App passwords page](https://myaccount.google.com/apppasswords)
- If it shows "This setting is not available for you", then 2FA is not enabled

### If you want to use a different email provider

You can change `EMAIL_HOST` to use Gmail's alternative (`gmail`), or use another provider like:

- **SendGrid**: `EMAIL_HOST=smtp.sendgrid.net`, Port: 587
- **Mailgun**: `EMAIL_HOST=smtp.mailgun.org`, Port: 587
- **Amazon SES**: `EMAIL_HOST=email-smtp.region.amazonaws.com`, Port: 587

## Testing After Update

1. Restart the backend server
2. The console should show: `✅ Email service connected successfully`
3. Try the forgot password flow
4. You should receive the reset email in your inbox

## Additional Notes

- App passwords are 16 characters long
- App passwords must be used for apps/services; your regular Gmail password won't work with port 587
- If you change your Google password, your app passwords remain valid
- You can revoke individual app passwords from the Google Account settings
