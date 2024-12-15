import React, { useRef, useState } from "react";

import { Pressable, Text, StyleSheet, View } from "react-native";
import FlowText from "./flowText";

type Props = {
  room: string;
};

const RoomTab: React.FC<Props> = ({ room }) => {
  return (
    <View style={style.tab}>
      <FlowText type={"text6"} flowText={room} />
    </View>
  );
};

export default RoomTab;

const style = StyleSheet.create({
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: "auto",
    alignSelf: "flex-start",
    backgroundColor: "#F7F7F9",
    borderRadius: 32,
  },
});
