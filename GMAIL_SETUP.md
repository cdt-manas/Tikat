# Gmail Setup Instructions for Tikat Email Service

## Step 1: Get a Gmail App Password

Since Gmail requires 2-factor authentication for app access, you need to generate an **App Password**.

### Instructions:

1. **Go to your Google Account**: https://myaccount.google.com/
2. **Enable 2-Step Verification** (if not already enabled):
   - Click on "Security" in the left sidebar
   - Under "How you sign in to Google", click "2-Step Verification"
   - Follow the prompts to set it up

3. **Generate App Password**:
   - Still in Security settings, click "2-Step Verification"
   - Scroll down to "App passwords"
   - Click "App passwords"
   - Select "Mail" and "Other (Custom name)"
   - Enter "Tikat Cinema" as the name
   - Click "Generate"
   - **Copy the 16-character password** (e.g., `abcd efgh ijkl mnop`)

## Step 2: Update Your .env File

Open `/Users/manas/Desktop/Tikat/server/.env` and replace the placeholders:

```bash
# Replace these lines:
SMTP_EMAIL=your-email@gmail.com          # Your Gmail address
SMTP_PASSWORD=your-app-password-here     # The 16-char password from step 1
FROM_EMAIL=your-email@gmail.com          # Your Gmail address again
```

**Example:**
```bash
SMTP_EMAIL=john.doe@gmail.com
SMTP_PASSWORD=abcd efgh ijkl mnop
FROM_EMAIL=john.doe@gmail.com
```

## Step 3: Restart Your Server

After updating `.env`:

1. Stop your current server (Ctrl+C in the terminal running `npm run dev`)
2. Start it again: `npm run dev`

## Step 4: Test It!

1. Register a new user with a **real email address** you can access
2. Check your email inbox (and spam folder) for the OTP
3. Enter the OTP to complete registration

---

## Troubleshooting

### Email Not Received?
- Check spam/junk folder
- Verify Gmail address is correct in `.env`
- Make sure app password has no spaces
- Ensure 2-Step Verification is enabled on your Google account

### "Invalid Credentials" Error?
- Regenerate app password
- Copy it exactly (no spaces)
- Make sure you're using app password, not your regular Gmail password

### Still Using Console Output?
- Make sure `.env` file is saved
- Restart the server after editing `.env`
- Check for typos in variable names (SMTP_EMAIL, SMTP_PASSWORD, etc.)

---

## Alternative: Use Ethereal (Testing Only)

If you don't want to use Gmail, the app will automatically use **Ethereal Email** (fake email service for testing):

1. Don't set SMTP_EMAIL or SMTP_PASSWORD in `.env`
2. After registration, check server console for "Preview URL"
3. Click the URL to see the email in your browser

**Note:** Ethereal emails aren't real - they're just for viewing in browser during development.

---

## Security Note

⚠️ **Never commit `.env` file to Git!** It's already in `.gitignore`, but double-check.

Your app password gives full email access, so keep it private.
