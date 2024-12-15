import React from "react";

import { Pressable, Text, StyleSheet, View, Image } from "react-native";
import FlowText from "./flowText";
import { DeviceTypes, Device } from "@/types/device";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import RoomTab from "./roomTab";

type Props = {
  device: Device;
  onPress: () => void;
};

const dataColor = "#75A7F7";
const iconColor = "#9A9B9E";

const DeviceView: React.FC<Props> = ({ device, onPress = () => {} }) => {
  const deviceInfoIcon = () => {
    switch (device.deviceType) {
      case DeviceTypes.Window:
        return (
          <MaterialCommunityIcons
            name={
              device.openStatus
                ? "window-open-variant"
                : "window-closed-variant"
            }
            size={24}
            color={dataColor}
          />
        );
      case DeviceTypes.Door:
        return (
          <FontAwesome5
            name={device.openStatus ? "door-open" : "door-closed"}
            size={24}
            color={dataColor}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Pressable
      style={style.device}
      onPress={() => {
        onPress();
      }}
    >
      <View style={style.deviceInfo}>
        <View style={style.deviceInfoIcon}>{deviceInfoIcon()}</View>
        <FlowText type={"text5"} flowText={device.name} color={"#130F26"} />
      </View>
      <View style={style.dataContainer}>
        <View style={style.dataItemsWrapper}>
          <View style={style.dataItemContainer}>
            <FontAwesome5
              name={device.openStatus ? "unlock" : "lock"}
              size={22}
              color={iconColor}
            />
            <FlowText
              type={"text5"}
              flowText={device.openStatus ? "open" : "closed"}
              color={dataColor}
            />
          </View>
          <View style={style.dataItemContainer}>
            <FontAwesome5 name={"temperature-high"} size={22} color={iconColor} />
            <FlowText
              type={"text5"}
              flowText={`${device.temperatur}°`}
              color={dataColor}
            />
          </View>
          <View style={style.dataItemContainer}>
            <FontAwesome6 name="droplet" size={22} color={iconColor} />
            <FlowText
              type={"text5"}
              flowText={`${device.humidity}%`}
              color={dataColor}
            />
          </View>
        </View>
        <RoomTab room={"Room 1"} />
      </View>
    </Pressable>
  );
};

export default DeviceView;

const style = StyleSheet.create({
  device: {
    marginHorizontal: 20,
    // width: "100%",
    backgroundColor: "#fff",
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  deviceInfo: {
    marginTop: 24,
    marginHorizontal: 16,
    flexDirection: "row",
  },
  deviceInfoIcon: {
    marginRight: 15,
    width: 50,
    height: 50,
    backgroundColor: "#D2E0EE",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  dataContainer: {
    marginTop: 18,
    marginBottom: 24,
    marginLeft: 16,
    marginRight: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dataItemsWrapper: {
    flexDirection: "row",
    columnGap: 8,
  },
  dataItemContainer: {
    flexDirection: "row",
    alignSelf: "flex-start",
    columnGap: 6,
  },
});
