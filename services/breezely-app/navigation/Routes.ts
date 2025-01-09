export type StackRoutesType = {
  Login: string;
  Home: string;
  DeviceInfo: string;
  EditDevice: string;
  Settings: string;
  Rooms: string;
  Development: string;
  Room: string;
  EditRoom: string;
  Favorites: string;
  EditProfile: string;
  EditProfileField: string;
  QrScan: string;
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
  EditRoom: "EditRoom",
  Room: "Room",
  Development: "Development",
  Favorites: "Favorites",
  EditProfile: "EditProfile",
  EditProfileField: "EditProfileField",
  QrScan: "QrScan",
};

export const TabRoutes: TabRoutesType = {
  App: "App",
  HomeStack: "HomeStack",
  FavoritesStack: "FavoritesStack",
  SettingsStack: "SettingsStack",
};

export type StackRouteNames = keyof typeof StackRoutes;
export type TabRouteNames = keyof typeof TabRoutes;
