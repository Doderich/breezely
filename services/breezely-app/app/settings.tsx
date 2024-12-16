import { BACKEND_URL } from "@/config/constants";
import { useUserInfo } from "@/hooks/queries/useUserInfo";
import { useAuth } from "@/hooks/useAuth";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";

export default function Settings({ navigation }: { navigation: any }) {
  const {data: userData, isLoading, isError} = useUserInfo()

  return (
    <View style={styles.container}>
      <Text>Settings</Text>
      <Text>userData: {JSON.stringify(userData)}</Text>
      <Text>IsLoading: {JSON.stringify(isLoading)}</Text>
      <Text>IsError: {JSON.stringify(isError)}</Text>
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
