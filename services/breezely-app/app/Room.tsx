import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

export default function Room({ navigation }: { navigation: any }) {
  return (
    <View style={styles.container}>
      <Text>Room</Text>
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
