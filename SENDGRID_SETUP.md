# SendGrid Email Service Setup

This guide will help you set up SendGrid for reliable email delivery in your FindMyStuff application.

## Why SendGrid?

- **Reliable**: Works consistently on Render and other cloud platforms
- **Free Tier**: 100 emails/day free forever
- **Production Ready**: Designed for transactional emails
- **Better Deliverability**: Higher inbox rates than Gmail SMTP

## Setup Steps

### 1. Create SendGrid Account

1. Go to [SendGrid.com](https://sendgrid.com)
2. Sign up for a free account
3. Verify your email address

### 2. Create API Key

1. In SendGrid dashboard, go to **Settings** → **API Keys**
2. Click **Create API Key**
3. Choose **Restricted Access**
4. Give it a name like "FindMyStuff API Key"
5. Under **Mail Send**, select **Full Access**
6. Click **Create & View**
7. **Copy the API key immediately** (you won't see it again)

### 3. Verify Sender Identity

You need to verify the email address you'll send from:

#### Option A: Single Sender Verification (Recommended for testing)
1. Go to **Settings** → **Sender Authentication**
2. Click **Verify a Single Sender**
3. Fill in your details:
   - **From Name**: FindMyStuff
   - **From Email**: your-email@yourdomain.com
   - **Reply To**: your-email@yourdomain.com
4. Check your email and click the verification link

#### Option B: Domain Authentication (Recommended for production)
1. Go to **Settings** → **Sender Authentication**
2. Click **Authenticate Your Domain**
3. Follow the DNS setup instructions

### 4. Update Environment Variables

Update your `.env` file with:

```bash
# Email (SendGrid)
SENDGRID_API_KEY=your_sendgrid_api_key_here
EMAIL_FROM=your-verified-email@yourdomain.com
```

### 5. Test the Setup

Run the test script to verify everything works:

```bash
cd backend
node test-email.js
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `SENDGRID_API_KEY` | Your SendGrid API key | `SG.abc123...` |
| `EMAIL_FROM` | Verified sender email | `noreply@yourdomain.com` |

## Render Deployment

1. In your Render dashboard, go to your service
2. Go to **Environment** tab
3. Add the environment variables:
   - `SENDGRID_API_KEY`: Your SendGrid API key
   - `EMAIL_FROM`: Your verified sender email

## Troubleshooting

### Common Issues

1. **"SENDGRID_API_KEY is required"**
   - Make sure you've set the environment variable correctly
   - Check for typos in the variable name

2. **"The from address does not match a verified Sender Identity"**
   - Verify your sender email in SendGrid dashboard
   - Make sure `EMAIL_FROM` matches your verified email

3. **"Invalid API key"**
   - Regenerate your API key in SendGrid
   - Make sure you copied the full key

### Testing

You can test the email service by:

1. Running the test script: `node test-email.js`
2. Signing up for a new account (will send verification email)
3. Requesting a login OTP

## Migration from Gmail SMTP

The following changes were made:

- ✅ Replaced `nodemailer` with `@sendgrid/mail`
- ✅ Updated `email.service.js` to use SendGrid API
- ✅ Updated environment variables in `env.example`
- ✅ Maintained the same `sendEmail` function interface

No changes needed in your application code - the email service interface remains the same!
