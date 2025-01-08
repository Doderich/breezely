import React, { useEffect } from "react";
import { Authenticated, NonAuthenticated } from "@/navigation/MainNavigation";
import { useAuth } from "@/hooks/useAuth";
import { focusManager, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import { AppState, AppStateStatus, Platform } from "react-native";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  useReactQueryDevTools(queryClient);
  const { user } = useAuth();
  function onAppStateChange(status: AppStateStatus) {
    if (Platform.OS !== 'web') {
      focusManager.setFocused(status === 'active')
    }
  }
  useEffect(() => {
    const subscription = AppState.addEventListener('change', onAppStateChange)
  
    return () => subscription.remove()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      {user ? <Authenticated /> : <NonAuthenticated />}
    </QueryClientProvider>
  );
}
