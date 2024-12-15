import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  SafeAreaView,
  FlatList,
} from "react-native";
import { StackRoutes } from "@/navigation/Routes";
import FlowText from "@/componets/flowText";
import FilterTab from "@/componets/filterTab";
import AddButton from "@/componets/addButton";
import DeviceView from "@/componets/deviceView";

import { Device, DeviceTypes } from "@/types/device";

const devices = [
  {
    name: "Window 1",
    openStatus: false,
    temperatur: 20,
    humidity: 50,
    deviceType: DeviceTypes.Window,
    roomId: "1",
    deviceId: "1",
    createdAt: new Date().toISOString(),
  },
  {
    name: "Living Room Window",
    openStatus: true,
    temperatur: 22,
    humidity: 45,
    deviceType: DeviceTypes.Window,
    roomId: "2",
    deviceId: "2",
    createdAt: new Date().toISOString(),
  },
  {
    name: "Kitchen Door",
    openStatus: true,
    temperatur: 19,
    humidity: 55,
    deviceType: DeviceTypes.Door,
    roomId: "3",
    deviceId: "3",
    createdAt: new Date().toISOString(),
  },
  {
    name: "Bedroom Window",
    openStatus: true,
    temperatur: 21,
    humidity: 48,
    deviceType: DeviceTypes.Window,
    roomId: "4",
    deviceId: "4",
    createdAt: new Date().toISOString(),
  },
  {
    name: "Garage Door",
    openStatus: false,
    temperatur: 18,
    humidity: 60,
    deviceType: DeviceTypes.Door,
    roomId: "5",
    deviceId: "5",
    createdAt: new Date().toISOString(),
  },
  {
    name: "Bathroom Window",
    openStatus: false,
    temperatur: 23,
    humidity: 65,
    deviceType: DeviceTypes.Window,
    roomId: "6",
    deviceId: "6",
    createdAt: new Date().toISOString(),
  },
];

const rooms = [
  {
    id: "1",
    name: "Living Room",
  },
  {
    id: "2",
    name: "Kitchen",
  },
  {
    id: "3",
    name: "Bedroom",
  },
  {
    id: "4",
    name: "Bathroom",
  },
  {
    id: "5",
    name: "Garage",
  },
  {
    id: "6",
    name: "Guest Room",
  },
];

export default function Home({ navigation }: { navigation: any }) {
  return (
    <SafeAreaView style={style.container}>
      <View style={style.header}>
        <FlowText flowText={"Good afternoon,"} type="text1" />
        <FlowText flowText={"John Doe"} type="text2" />
      </View>
      <View style={style.filterTabs}>
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={rooms}
          contentContainerStyle={{ paddingHorizontal: 8 }}
          ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
          renderItem={({ item }) => (
            <FilterTab
              isActive={false}
              title={item.name}
              tabId={item.id}
              onPress={() => {}}
            />
          )}
        />
      </View>
      <View style={style.addDeviceContainer}>
        <FlowText flowText={"Devices"} type="text3" />
        <AddButton onPress={() => {}} />
      </View>
      {/* <View style={style.devicesContainer}> */}
        <FlatList
          horizontal={false}
          showsVerticalScrollIndicator={false}
          data={devices}
          contentContainerStyle={{ paddingVertical: 8 }}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          renderItem={({ item }) => (
            <DeviceView device={item} onPress={() => {}} />
          )}
        />
      {/* </View> */}
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  header: {
    marginHorizontal: 20,
    marginTop: 40,
    marginBottom: 20,
    flexDirection: "column",
  },
  addDeviceContainer: {
    marginHorizontal: 20,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  filterTabs: {
    marginBottom: 20,
  },
  devicesContainer: {
    // marginHorizontal: 20,
  },
});
