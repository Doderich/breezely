import React, { useRef, useState } from "react";

import { Pressable, Text, StyleSheet, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FlowText from "./flowText";

type Props = {
  info: string;
  data: string;
  onPress?: () => void;
  isUserInfo?: boolean;
};

const InfoLabel: React.FC<Props> = ({
  info,
  data,
  onPress,
  isUserInfo = false,
}) => {
  return (
    <Pressable style={style.container} onPress={onPress}>
      <FlowText type={"text7"} flowText={info} color={"#868686"} />
      <View style={style.dataContainer}>
        <FlowText type={"text7"} flowText={data} color={"#130F26"} />
        {isUserInfo && (
          <MaterialIcons name="arrow-forward-ios" size={12} color="black" />
        )}
      </View>
    </Pressable>
  );
};

export default InfoLabel;

const style = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#fff",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    paddingLeft: 16,
    paddingRight: 30,
    borderRadius: 10,
  },
  dataContainer: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
  },
});
