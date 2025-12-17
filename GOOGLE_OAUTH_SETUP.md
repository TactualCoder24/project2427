# Google OAuth Setup Instructions

## Prerequisites
- Google Cloud Console account
- Your React application running on `http://localhost:3000`

## Step-by-Step Setup

### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name (e.g., "Agentic AI Agency")
4. Click "Create"

### 2. Enable Google Identity Services
1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google Identity Services API"
3. Click on it and press "Enable"

### 3. Configure OAuth Consent Screen
1. Go to "APIs & Services" → "OAuth consent screen"
2. Choose "External" user type
3. Fill in required fields:
   - App name: "Agentic AI Agency"
   - User support email: Your email
   - Developer contact information: Your email
4. Click "Save and Continue"
5. Skip "Scopes" and "Test users" sections
6. Review and submit

### 4. Create OAuth 2.0 Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Name: "Agentic AI Web Client"
5. Add Authorized JavaScript origins:
   - `http://localhost:3000`
   - `https://yourdomain.com` (for production)
6. Add Authorized redirect URIs:
   - `http://localhost:3000`
   - `https://yourdomain.com` (for production)
7. Click "Create"

### 5. Configure Your Application
1. Copy the Client ID from the credentials page
2. Open the `.env` file in your project root
3. Replace `YOUR_GOOGLE_CLIENT_ID_HERE` with your actual Client ID:
   ```
   REACT_APP_GOOGLE_CLIENT_ID=your-actual-client-id-here.apps.googleusercontent.com
   ```
4. Restart your development server

### 6. Test the Integration
1. Start your React app: `npm start`
2. Go to the Login page
3. Click "Continue with Google"
4. Complete the OAuth flow
5. You should be redirected to the Dashboard with your Google profile data

## Security Notes
- Never commit your actual Client ID to version control
- Use environment variables for all sensitive configuration
- For production, add your production domain to authorized origins
- Consider implementing proper user session management for production use

## Troubleshooting
- **"Error 400: redirect_uri_mismatch"**: Check that your redirect URIs match exactly
- **"This app isn't verified"**: Normal for development, click "Advanced" → "Go to [app name]"
- **Login not working**: Check browser console for errors and verify Client ID is correct

## Production Deployment
When deploying to production:
1. Add your production domain to authorized origins in Google Cloud Console
2. Update the `.env` file with production Client ID
3. Ensure HTTPS is enabled for your production domain
