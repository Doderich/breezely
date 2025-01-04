import React, { useEffect, useState } from "react";
import ProfileTab from "@/componets/profileTab";
import { useUserInfo } from "@/hooks/queries/useUserInfo";
import { useAuth } from "@/hooks/useAuth";
import { View, StyleSheet, SafeAreaView, Alert, Text, TextInput, Button } from "react-native";
import { StackRoutes } from "@/navigation/Routes";
import ScreenTab from "@/componets/screenTab";
import { Controller, useForm } from "react-hook-form";
import { BACKEND_URL_KEY, getBackendUrl } from "@/config/constants";
import { setItemAsync } from "expo-secure-store";

export default function Development({ navigation }: { navigation: any }) {
  const { data: user, isLoading, isError } = useUserInfo();
  const { logout } = useAuth();
  const form = useForm<{backendUrl: string}>({
    defaultValues: {
    },
  });

  useEffect(() => {
    const fetchBackendUrl = async () => {
      try {
        const url = await getBackendUrl();
        form.setValue('backendUrl', url);
      } catch (e) {
        console.error(e);
      }
    }
    fetchBackendUrl();
  }, []);
 

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.settingContainer}>
        <Controller
          control={form.control}
          render={({ field: { onChange, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="Backend URL"
            />
          )}
          name="backendUrl"
        />
        <Button
          title="Save"
          onPress={form.handleSubmit(async (data) => {
            await setItemAsync(BACKEND_URL_KEY,data.backendUrl);
          })}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  profileTabContainer: {
    marginHorizontal: 8,
    marginTop: 15,
  },
  settingContainer: {
    marginHorizontal: 12,
    marginTop: 20,
  },
});
