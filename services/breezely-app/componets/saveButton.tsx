import React from "react";

import { Pressable, StyleSheet } from "react-native";
import FlowText from "./flowText";

type Props = {
  onPress: () => void;
};

const SaveButton: React.FC<Props> = ({ onPress = () => {} }) => {
  return (
    <Pressable
      style={style.btn}
      onPress={() => {
        onPress();
      }}
    >
      <FlowText type={"text5"} flowText={"Save"} color="#fff" />
    </Pressable>
  );
};

export default SaveButton;

const style = StyleSheet.create({
  btn: {
    backgroundColor: "#1F204A",
    width: "100%",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
});
