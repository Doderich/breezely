import React from "react";

import { Pressable, StyleSheet } from "react-native";
import FlowText from "./flowText";

type Props = {
  onPress: () => void;
};

const AddButton: React.FC<Props> = ({ onPress = () => {} }) => {
  return (
    <Pressable
      style={style.btn}
      onPress={() => {
        onPress();
      }}
    >
      <FlowText type={"text4"} flowText={"+ Add"} />
    </Pressable>
  );
};

export default AddButton;

const style = StyleSheet.create({
  btn: {
    backgroundColor: "#1F204A",
    width: "auto",
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 40,
  },
});
