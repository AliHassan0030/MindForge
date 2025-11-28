import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// ==================================================================================
// GOOGLE OAUTH SETUP (Optional)
// ==================================================================================
// To enable Google Sign-In, replace the placeholder below with your Client ID.
// If left as a placeholder, the Google Sign-In button will simply be hidden.
// ==================================================================================

const GOOGLE_CLIENT_ID = "PASTE_YOUR_REAL_CLIENT_ID_HERE.apps.googleusercontent.com"; 

// Check if the ID is valid (not the placeholder)
const isGoogleConfigured = !GOOGLE_CLIENT_ID.includes("PASTE_YOUR_REAL_CLIENT_ID_HERE");

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App googleAuthEnabled={isGoogleConfigured} />
    </GoogleOAuthProvider>
  </React.StrictMode>
);