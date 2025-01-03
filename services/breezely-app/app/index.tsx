import { Button, Text, View, StyleSheet, Image } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useAuth } from "@/hooks/useAuth";
import { usePushnotification } from "@/hooks/usePushnotifications";

WebBrowser.maybeCompleteAuthSession();

export default function App() {

  const {
    setCodeUsed,
    promptAsync,
  } = useAuth();

  return (
    
      <View style={styles.container}>
        <Image
          style={styles.logo}
          source={ require('../assets/images/BreezelyLogo.png')}
        />
        <View style={[{ width: "90%", margin: 10 }]}>
        <Button
          title="Log in"
          onPress={() => {
            setCodeUsed(false);
            promptAsync();
          }}
        />
        </View> 

      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: 5,
  },
  logo: {
    width: 300,
    height: 300,
  },

});
