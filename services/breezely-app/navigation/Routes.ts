export type StackRoutesType = {
  Login: string;
  Home: string;
  DeviceInfo: string;
  EditDevice: string;
  Settings: string;
  Rooms: string;
  Room: string;
  Favorites: string;
  EditProfile: string;
  EditProfileField: string;
};

export type TabRoutesType = {
  App: string;
  HomeStack: string;
  FavoritesStack: string;
  SettingsStack: string;
};

export const StackRoutes: StackRoutesType = {
  Login: "Login",
  Home: "Home",
  DeviceInfo: "DeviceInfo",
  EditDevice: "EditDevice",
  Settings: "Settings",
  Rooms: "Rooms",
  Room: "Room",
  Favorites: "Favorites",
  EditProfile: "EditProfile",
  EditProfileField: "EditProfileField",
};

export const TabRoutes: TabRoutesType = {
  App: "App",
  HomeStack: "HomeStack",
  FavoritesStack: "FavoritesStack",
  SettingsStack: "SettingsStack",
};

export type StackRouteNames = keyof typeof StackRoutes;
export type TabRouteNames = keyof typeof TabRoutes;
