import { Button, Text, View, StyleSheet } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useAuth } from "@/hooks/useAuth";
import { usePushnotification } from "@/hooks/usePushnotifications";

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import { ReactQueryExample } from "@/componets/reactquery-example";

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const queryClient = new QueryClient();
  useReactQueryDevTools(queryClient);

  const { expoPushToken, notification } = usePushnotification();

  const data = JSON.stringify(notification, undefined, 2);

  const {
    request,
    user,
    setCodeUsed,
    promptAsync,
    logout,
    setAuthError,
    authError,
  } = useAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <View style={styles.container}>
        <View style={styles.row}>
          <View>
            <Button
              disabled={!request || !!user}
              title="Log in"
              onPress={() => {
                setCodeUsed(false);
                promptAsync();
              }}
            />
          </View>

          <Button disabled={!user} title="Log out" onPress={logout} />
          <Button
            disabled={!authError}
            title="Clear"
            onPress={() => setAuthError(null)}
          />
        </View>

        {authError ? (
          <>
            <Text style={[styles.heading]}>Auth Error:</Text>
            <Text style={[styles.text, styles.error]}>{authError}</Text>
          </>
        ) : null}
        {/* <Text style={[styles.heading]}>Redirect Uri:</Text>
      <Text style={[styles.text]}>{redirectUri}</Text> */}
        <Text style={[styles.heading]}>Token Data:</Text>
        {user ? (
          <Text style={[styles.text]}>{JSON.stringify(user.decoded)}</Text>
        ) : null}

        <Text>Token: {expoPushToken?.data}</Text>
        <Text>{data}</Text>
        <ReactQueryExample />
      </View>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "stretch",
    justifyContent: "flex-start",
    width: "100%",
    padding: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  heading: {
    padding: 5,
    fontSize: 24,
  },
  text: {
    padding: 5,
    fontSize: 14,
  },
  error: {
    color: "red",
  },
});
