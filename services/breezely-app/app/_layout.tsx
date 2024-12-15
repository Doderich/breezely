import React from "react";
import { Authenticated, NonAuthenticated } from "@/navigation/MainNavigation";
import { useAuth } from "@/hooks/useAuth";

export default function RootLayout() {
  const { user } = useAuth();

  return user ? <Authenticated /> : <NonAuthenticated />;
}
