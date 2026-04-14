import { setAuthSession, type AuthSession } from './auth';

const GOOGLE_SCRIPT_ID = 'google-identity-services';
const GOOGLE_SDK_URL = 'https://accounts.google.com/gsi/client';

interface GoogleTokenResponse {
  access_token?: string;
  error?: string;
  error_description?: string;
}

interface GoogleUserInfo {
  sub: string;
  email: string;
  name: string;
  picture?: string;
}

let sdkPromise: Promise<void> | null = null;

function getGoogleClientId(): string {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error('Missing VITE_GOOGLE_CLIENT_ID. Add it to your .env file.');
  }
  return clientId;
}

function loadGoogleSdk(): Promise<void> {
  if (window.google?.accounts?.oauth2) {
    return Promise.resolve();
  }

  if (sdkPromise) {
    return sdkPromise;
  }

  sdkPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.getElementById(GOOGLE_SCRIPT_ID);
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(), { once: true });
      existingScript.addEventListener('error', () => reject(new Error('Failed to load Google Identity Services SDK.')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = GOOGLE_SCRIPT_ID;
    script.src = GOOGLE_SDK_URL;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Identity Services SDK.'));
    document.head.appendChild(script);
  });

  return sdkPromise;
}

async function fetchGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo> {
  const response = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Unable to fetch Google profile information.');
  }

  return (await response.json()) as GoogleUserInfo;
}

export async function signInWithGoogle(mode: 'login' | 'signup' = 'login'): Promise<AuthSession> {
  await loadGoogleSdk();
  const clientId = getGoogleClientId();

  const tokenResponse = await new Promise<GoogleTokenResponse>((resolve, reject) => {
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'openid email profile',
      callback: (response: GoogleTokenResponse) => {
        if (response.error || !response.access_token) {
          reject(new Error(response.error_description || response.error || 'Google sign-in failed.'));
          return;
        }
        resolve(response);
      },
    });

    tokenClient.requestAccessToken({
      prompt: mode === 'signup' ? 'consent select_account' : 'select_account',
    });
  });

  const userInfo = await fetchGoogleUserInfo(tokenResponse.access_token);
  const session: AuthSession = {
    provider: 'google',
    accessToken: tokenResponse.access_token,
    user: {
      id: userInfo.sub,
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
    },
  };

  setAuthSession(session);
  return session;
}
