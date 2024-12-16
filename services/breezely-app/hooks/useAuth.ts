import { AUTHORIZE_URI, CLIENT_ID, SCOPES, TOKEN_URL } from '@/config/constants';
import { AccessTokenRequest, exchangeCodeAsync, fetchDiscoveryAsync, makeRedirectUri, refreshAsync, TokenResponse, TokenResponseConfig, useAuthRequest } from 'expo-auth-session';
import { setItemAsync, getItemAsync, deleteItemAsync } from 'expo-secure-store';
import { coolDownAsync, warmUpAsync } from 'expo-web-browser';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { Platform } from 'react-native';
import * as Application from 'expo-application';

const AUTH_STORAGE_KEY = "refreshToken"
const storeRefreshToken = async (token: string) => setItemAsync(AUTH_STORAGE_KEY, token)
const deleteRefreshToken = async () => deleteItemAsync(AUTH_STORAGE_KEY)
const fetchRefreshToken = async () => getItemAsync(AUTH_STORAGE_KEY)

const ACCESS_TOKEN_KEY = "accessToken"
const storeAccessToken = async (token: string) => setItemAsync(ACCESS_TOKEN_KEY, token)
const deleteAccessToken = async () => deleteItemAsync(ACCESS_TOKEN_KEY)
const fetchAccessToken = async () => getItemAsync(ACCESS_TOKEN_KEY)

interface User {
    idToken: string;
    decoded: any;
  }
  interface StoreConfig {
    user: null | User;
    accessToken: string | null; // Add accessToken to the store
    authError: null | string;
    logout: () => void;
    setAuthError: (authError: string | null) => void;
    setTokenResponse: (responseToken: TokenResponse) => void;
    maybeRefreshToken: () => Promise<void>;
  }
  
  export const useUserStore = create<StoreConfig>((set, get) => ({
    user: null,
    accessToken: null,
    authError: null,
    setAuthError: (authError: string | null) => set({ authError }),
  
    logout: async () => {
      try {
        set({ user: null, accessToken: null, authError: null });
        await Promise.all([
          deleteItemAsync(AUTH_STORAGE_KEY),
          deleteItemAsync(ACCESS_TOKEN_KEY)
        ]);
      } catch (err: any) {
        set({ authError: "LOGOUT: " + (err.message || "something went wrong") });
      }
    },
  
    setTokenResponse: async (responseToken: TokenResponse) => {
      const tokenConfig: TokenResponseConfig = responseToken.getRequestConfig();
      const { idToken, accessToken } = tokenConfig;
  
      if (accessToken) {
        await setItemAsync(ACCESS_TOKEN_KEY, accessToken);
        set({ accessToken });
      }
  
      if (idToken) {
        const decoded = jwtDecode(idToken);
        set({ user: { idToken, decoded } });
      }
    },
  
    maybeRefreshToken: async () => {
      try {
        const storedAccessToken = await getItemAsync(ACCESS_TOKEN_KEY);
        if (storedAccessToken) {
          // Check if token is expired
          try {
            const decoded = jwtDecode(storedAccessToken);
            const currentTime = Date.now() / 1000;
            if (decoded.exp && decoded.exp > currentTime) {
              set({ accessToken: storedAccessToken });
              return;
            }
          } catch (e) {
            console.log('Invalid token:', e);
          }
        }
        // If we get here, either there's no token or it's expired
        await get().logout();
      } catch (error) {
        console.error('Token validation failed:', error);
        await get().logout();
      }
    },
  }));
  

export const useAuth = () => {
  const { user, authError, setAuthError, accessToken, setTokenResponse, maybeRefreshToken, logout } = useUserStore()
  const [cacheTried, setCacheTried] = useState(false)
  const [codeUsed, setCodeUsed] = useState(false)
  const [isHandlingAuth, setIsHandlingAuth] = useState(false)

  const redirectUri = makeRedirectUri({
    native: Platform.select({
      ios: `${Application.applicationId}://oauth2redirect`,
      android: `${Application.applicationId}://oauth2redirect`
    }),
  });

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: CLIENT_ID,
      redirectUri,
      scopes: SCOPES,
    },
    {
      authorizationEndpoint: AUTHORIZE_URI,
    }
  );

  useEffect(() => {
    warmUpAsync();
    setAuthError(null);
    return () => { coolDownAsync(); };
  }, []);

  useEffect(() => {
    if (user || cacheTried) return
    setCacheTried(true)
    maybeRefreshToken();
  }, [cacheTried, maybeRefreshToken, user])

  useEffect(() => {
    const handleAuthResponse = async () => {
      if (isHandlingAuth || !response) return;

      setIsHandlingAuth(true);
      
      try {
        console.log('Processing auth response:', response.type);
        
        if (response.type === "error") {
          console.error('Auth Error:', response.error);
          setAuthError("promptAsync: " + (response.params.error || "something went wrong"))
          return;
        }

        if (response.type === "dismiss") {
          console.log('Auth dismissed by user');
          return;
        }

        if (response.type !== "success") {
          console.log('No success response:', response.type);
          return;
        }

        const code = response.params.code;
        if (!code || codeUsed) {
          console.log('No code in response or code already used');
          return;
        }

        console.log('Getting token with code:', code);
        setCodeUsed(true);
        
        const accessToken = new AccessTokenRequest({
          code,
          clientId: CLIENT_ID,
          redirectUri,
          scopes: SCOPES,
          extraParams: {
            code_verifier: request?.codeVerifier ? request.codeVerifier : "",
          },
        });

        const tokenResponse = await exchangeCodeAsync(accessToken, {tokenEndpoint: TOKEN_URL});
        console.log('Token response received');
        await setTokenResponse(tokenResponse);
      } catch (e: any) {
        console.error('Token exchange error:', e);
        setAuthError("ACCESS TOKEN: " + (e.message || "something went wrong"))
      } finally {
        setIsHandlingAuth(false);
      }
    };

    handleAuthResponse();
  }, [response, codeUsed, request?.codeVerifier, redirectUri]);

  const authenticatedFetch = async (input: RequestInfo, init?: RequestInit) => {
    const options = init ?? {};
    if (accessToken) {
      if (!options.headers) options.headers = {};
      // @ts-ignore
      options.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetch(input, options);
    if (response.status === 401) {
      await logout();
      throw new Error('Session expired. Please login again.');
    }
    return response;
  };

  return {
    coolDownAsync,
    codeUsed,
    request,
    user,
    setCodeUsed,
    promptAsync,
    logout,
    authError,
    setAuthError,
    authenticatedFetch
  }
}