import React, { useRef, useState } from "react";

import { Pressable, Text, StyleSheet, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FlowText from "./flowText";
import { Device, DeviceTypes } from "@/types/device";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

type Props = {
  device: Device;
};

const dataColor = "#75A7F7";

const deviceInfoLabel: React.FC<Props> = ({ device }) => {
  const deviceInfoIcon = () => {
    switch (device.device.type) {
      case "Window":
        return (
          <MaterialCommunityIcons
            name={
              device.telemetry.window_status[0].value
                ? "window-open-variant"
                : "window-closed-variant"
            }
            size={24}
            color={dataColor}
          />
        );
      case "Door":
        return (
          <FontAwesome5
            name={device.telemetry.window_status[0].value ? "door-open" : "door-closed"}
            size={24}
            color={dataColor}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={style.deviceInfo}>
      <View style={style.deviceInfoIcon}>{deviceInfoIcon()}</View>
      <FlowText type={"text5"} flowText={device.device.name} color={"#130F26"} />
    </View>
  );
};

export default deviceInfoLabel;

const style = StyleSheet.create({
  deviceInfoIcon: {
    marginRight: 15,
    width: 50,
    height: 50,
    backgroundColor: "#D2E0EE",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  deviceInfo: {
    marginTop: 24,
    marginHorizontal: 16,
    flexDirection: "row",
  },
});
