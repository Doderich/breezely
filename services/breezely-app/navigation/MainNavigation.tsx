import React from "react";
import { Platform, Pressable, View } from "react-native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StackRoutes, TabRoutes } from "./Routes";

import Ionicons from "@expo/vector-icons/Ionicons";

import Login from "@/app/index";
import Home from "@/app/home";
import DeviceInfo from "@/app/deviceInfo";
import Settings from "@/app/settings";
import Favorites from "@/app/favorites";
import EditDevice from "@/app/editDevice";
import EditProfile from "@/app/editProfile";
import EditProfileField from "@/app/editProfileField";
import Room from "@/app/room";
import Rooms from "@/app/rooms";
import Feather from "@expo/vector-icons/Feather";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export const NonAuthenticated = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name={StackRoutes.Login} component={Login} />
    </Stack.Navigator>
  );
};

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={StackRoutes.Home}
        component={Home}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const SettingsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={StackRoutes.Settings}
        component={Settings}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const FavoritesStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={StackRoutes.Favorites}
        component={Favorites}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const HomeTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName={TabRoutes.HomeStack}
      screenOptions={({ route, navigation }) => ({
        tabBarStyle: {
          paddingTop: 10,
          backgroundColor: "#fff",
          height: Platform.select({
            ios: 65,
            android: 50,
          }),
        },
        headerShown: false,
        header: () => null,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          color = "#000000";
          if (route.name === "HomeStack") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "FavoritesStack") {
            iconName = focused ? "heart" : "heart-outline";
          } else if (route.name === "SettingsStack") {
            iconName = focused ? "settings" : "settings-outline";
          }
          return <Ionicons name={iconName as any} size={26} color={color} />;
        },
        tabBarLabel: () => null,
      })}
    >
      <Tab.Screen name={TabRoutes.HomeStack} component={HomeStack} />
      {/* <Tab.Screen name={TabRoutes.FavoritesStack} component={FavoritesStack} /> */}
      <Tab.Screen name={TabRoutes.SettingsStack} component={SettingsStack} />
    </Tab.Navigator>
  );
};

export const Authenticated = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={TabRoutes.App}
        component={HomeTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={StackRoutes.DeviceInfo}
        component={DeviceInfo}
        options={{ headerBackTitle: "Home" }}
      />
      <Stack.Screen name={StackRoutes.EditDevice} component={EditDevice} />
      <Stack.Screen
        name={StackRoutes.Rooms}
        component={Rooms}
        options={{ headerBackTitle: "Settings" }}
      />
      <Stack.Screen
        name={StackRoutes.Room}
        component={Room}
        options={{
          headerBackTitle: "Rooms",
          
        }}
      />
      <Stack.Screen
        name={StackRoutes.EditProfile}
        component={EditProfile}
        options={{ headerBackTitle: "Settings" }}
      />
      <Stack.Screen
        name={StackRoutes.EditProfileField}
        component={EditProfileField}
        options={{ headerBackTitle: "Edit Profile" }}
      />
    </Stack.Navigator>
  );
};
