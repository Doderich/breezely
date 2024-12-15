import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { StackRoutes } from "@/navigation/Routes";

export default function Home({ navigation }: { navigation: any }) {
  return (
    <View style={styles.container}>
      <Text>Home</Text>
      <Button
        title="Go to Device Info"
        onPress={() => navigation.navigate(StackRoutes.DeviceInfo)}
      />
    </View>
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
});
