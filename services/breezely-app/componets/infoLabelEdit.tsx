import React, { useRef, useState } from "react";
import { StyleSheet, View, TextInput } from "react-native";
import FlowText from "./flowText";

type Props = {
  info: string;
  data: string;
  onChangeText?: (text: string) => void;
};

const InfoLabelEdit: React.FC<Props> = ({ info, data, onChangeText }) => {
  return (
    <View style={style.container}>
      <FlowText type={"text7"} flowText={info} color={"#868686"} />
      <View style={style.dataContainer}>
        <TextInput
          value={data}
          onChangeText={onChangeText}
          style={style.input}
          placeholder={"................"}
          placeholderTextColor="#868686"
        />
      </View>
    </View>
  );
};

export default InfoLabelEdit;

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
  input: {
    fontSize: 14,
    color: "#130F26",
    padding: 0,
    minWidth: 100,
    maxWidth: 200,
  },
});
