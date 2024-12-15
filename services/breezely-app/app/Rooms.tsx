import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

export default function Rooms({ navigation }: { navigation: any }) {
  return (
    <View style={styles.container}>
      <Text>Rooms</Text>
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
