import React, { useRef, useState } from "react";

import { View, Text, Pressable, StyleSheet } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FlowText from "./flowText";

type Props = {
  title: string;
  textColor?: string;
  onPress: () => void;
};

const ScreenTab: React.FC<Props> = ({ title, textColor, onPress }) => {
  return (
    <Pressable style={[style.setting]} onPress={onPress}>
      <FlowText flowText={title} type={"text5"} color={textColor || "#000"} />
      {!textColor && (
        <MaterialIcons name="arrow-forward-ios" size={12} color="black" />
      )}
    </Pressable>
  );
};

export default ScreenTab;

const style = StyleSheet.create({
  setting: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingLeft: 16,
    paddingRight: 20,
    paddingVertical: 22,
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 3,
  },
});
