import { AUTHORIZE_URI, CLIENT_ID, SCOPES, TOKEN_URL } from '@/config/constants';
import { AccessTokenRequest, exchangeCodeAsync, fetchDiscoveryAsync, makeRedirectUri, refreshAsync, TokenResponse, TokenResponseConfig, useAuthRequest } from 'expo-auth-session';
import { setItemAsync, getItemAsync, deleteItemAsync } from 'expo-secure-store';
import { coolDownAsync, warmUpAsync } from 'expo-web-browser';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { create } from 'zustand';

const AUTH_STORAGE_KEY = "refreshToken"
const storeRefreshToken = async (token: string) => setItemAsync(AUTH_STORAGE_KEY, token)
const deleteRefreshToken = async () => deleteItemAsync(AUTH_STORAGE_KEY)
const fetchRefreshToken = async () => getItemAsync(AUTH_STORAGE_KEY)

interface User {
    idToken: string;
    decoded: any;
  }
  interface StoreConfig {
    user: null | User;
    authError: null | string;
    logout: () => void;
    setAuthError: (authError: string | null) => void;
    setTokenResponse: (responseToken: TokenResponse) => void;
    maybeRefreshToken: () => Promise<void>;
  
  }
  
  export const useUserStore = create<StoreConfig>((set, get) => ({
  
    user: null,
    authError: null,
    setAuthError: (authError: string | null) => set({ authError }),
  
    logout: async () => {
      try {
        set({ user: null, authError: null })
        deleteRefreshToken()
  
        // // IF YOUR PROVIDER SUPPORTS A `revocationEndpoint` (which Azure AD does not):
        // const token = await fetchRefreshToken()
        // const discovery = get().discovery || await fetchDiscoveryAsync(endpoint)
        // await token ? revokeAsync({ token, clientId }, discovery) : undefined
      } catch (err: any) {
        set({ authError: "LOGOUT: " + (err.message || "something went wrong") })
      }
    },
  
    setTokenResponse: (responseToken: TokenResponse) => {
      // cache the token for next time
      const tokenConfig: TokenResponseConfig = responseToken.getRequestConfig()
      const { idToken, refreshToken } = tokenConfig;
  
      refreshToken && storeRefreshToken(refreshToken);
  
      // extract the user info
      if (!idToken) return
      const decoded = jwtDecode(idToken);
      set({ user: { idToken, decoded } })
    },
  
    maybeRefreshToken: async () => {
      const refreshToken = await fetchRefreshToken();
      if (!refreshToken) return // nothing to do
      get().setTokenResponse(await refreshAsync({ clientId: CLIENT_ID, refreshToken }, {
      tokenEndpoint: TOKEN_URL
    }))
    },
  
  }));


export const useAuth = () => {
const { user, authError, setAuthError, setTokenResponse, maybeRefreshToken, logout } = useUserStore()
  const [cacheTried, setCacheTried] = useState(false)
  const [codeUsed, setCodeUsed] = useState(false)

  const redirectUri = makeRedirectUri()

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: CLIENT_ID,
      redirectUri,
      scopes: SCOPES,
    },
    {
      authorizationEndpoint: AUTHORIZE_URI
    }
  );

  useEffect(() => {
    warmUpAsync();
    setAuthError(null);
    return () => { coolDownAsync(); };
  }, []);

  useEffect(() => {
    // try to fetch stored creds on load if not already logged (but don't try it
    // more than once)
    if (user || cacheTried) return
    setCacheTried(true) // 
    maybeRefreshToken();
  }, [cacheTried, maybeRefreshToken, user])

  useEffect(() => {

    if (
      codeUsed  // Access tokens are only good for a single use
    ) return

    if (response?.type === "error") {
      setAuthError("promptAsync: " + (response.params.error || "something went wrong"))
      return
    }

    if (response?.type !== "success") return;
    const code = response.params.code;
    if (!code) return;

    const getToken = async () => {

      let stage = "ACCESS TOKEN"
      try {
        setCodeUsed(true)
        const accessToken = new AccessTokenRequest({
          code, clientId: CLIENT_ID, redirectUri,
          scopes: SCOPES,
          extraParams: {
            code_verifier: request?.codeVerifier ? request.codeVerifier : "",
          },
        });
        stage = "EXCHANGE TOKEN"

        setTokenResponse(await exchangeCodeAsync(accessToken, {tokenEndpoint: TOKEN_URL}))
      } catch (e: any) {
        setAuthError(stage + ": " + (e.message || "something went wrong"))
      }
    }
    getToken()

  }, [response, codeUsed])   

  return {
    coolDownAsync,
    codeUsed,
    request,
    user,
    setCodeUsed,
    promptAsync,
    logout,
    authError,
    setAuthError
  }
}