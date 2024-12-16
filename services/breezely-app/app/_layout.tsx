import React from "react";
import { Authenticated, NonAuthenticated } from "@/navigation/MainNavigation";
import { useAuth } from "@/hooks/useAuth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useReactQueryDevTools } from "@dev-plugins/react-query";

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

  return (
    <QueryClientProvider client={queryClient}>
      {user ? <Authenticated /> : <NonAuthenticated />}
    </QueryClientProvider>
  );
}
