import React, { useEffect, useState } from "react";
import ProfileTab from "@/componets/profileTab";
import { useUserInfo } from "@/hooks/queries/useUserInfo";
import { useAuth } from "@/hooks/useAuth";
import { View, StyleSheet, SafeAreaView, Alert, Text } from "react-native";
import { StackRoutes } from "@/navigation/Routes";
import ScreenTab from "@/componets/screenTab";

export default function Development({ navigation }: { navigation: any }) {
  const { data: user, isLoading, isError } = useUserInfo();
  const { logout } = useAuth();

  const logoutUser = () =>
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
      },
      {
        text: "Logout",
        onPress: async () => {
          logout();
        },
      },
    ]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileTabContainer}>
        <ProfileTab
          name={isLoading ? "Loading ..." : user?.name ?? ""}
          email={isLoading ? "Loading ..." : user?.email ?? ""}
          buttonText="Edit Profile"
          onPress={() => {
            navigation.navigate("EditProfile");
          }}
        />
      </View>
      <View style={styles.settingContainer}>
        <ScreenTab
          title="Rooms"
          onPress={() => {
            navigation.navigate("Rooms");
          }}
      />
        {/* <Setting title="Language" onPress={()=> {}} /> */}
        {/* <Setting title="Development" onPress={() => {navigation.navigate("Development");}} /> */}
        <Text>Development</Text>
        <ScreenTab title="Logout" onPress={logoutUser} textColor={"#FF5C00"} />
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
