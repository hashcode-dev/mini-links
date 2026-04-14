/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface GoogleTokenClient {
  requestAccessToken: (options?: { prompt?: string }) => void;
}

interface GoogleAccountsOauth2 {
  initTokenClient: (config: {
    client_id: string;
    scope: string;
    callback: (response: { access_token?: string; error?: string; error_description?: string }) => void;
  }) => GoogleTokenClient;
}

interface GoogleAccounts {
  oauth2: GoogleAccountsOauth2;
}

interface GoogleIdentity {
  accounts: GoogleAccounts;
}

interface Window {
  google?: GoogleIdentity;
}
