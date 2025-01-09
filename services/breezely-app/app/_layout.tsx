import React, { useEffect } from "react";
import * as eva from "@eva-design/eva";
import { ApplicationProvider, Layout, Text } from "@ui-kitten/components";
import { Authenticated, NonAuthenticated } from "@/navigation/MainNavigation";
import { useAuth } from "@/hooks/useAuth";
import {
  focusManager,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import { AppState, AppStateStatus, Platform } from "react-native";
import { LogBox } from "react-native";

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
  LogBox.ignoreAllLogs();
  useReactQueryDevTools(queryClient);
  const { user } = useAuth();
  function onAppStateChange(status: AppStateStatus) {
    if (Platform.OS !== "web") {
      focusManager.setFocused(status === "active");
    }
  }
  useEffect(() => {
    const subscription = AppState.addEventListener("change", onAppStateChange);

    return () => subscription.remove();
  }, []);

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <QueryClientProvider client={queryClient}>
        {user ? <Authenticated /> : <NonAuthenticated />}
      </QueryClientProvider>
    </ApplicationProvider>
  );
}
