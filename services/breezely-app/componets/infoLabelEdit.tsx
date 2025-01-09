import React, { useRef, useState } from "react";
import { StyleSheet, View, TextInput, Pressable } from "react-native";
import FlowText from "./flowText";
import { useCameraPermissions } from "expo-camera";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { StackRoutes } from "@/navigation/Routes";

type Props = {
  info: string;
  data: string;
  onChangeText?: (text: string) => void;
  onBlur?: (text: any) => void;
  onNavigate?: () => void;
};

const InfoLabelEdit: React.FC<Props> = ({
  info,
  data,
  onChangeText,
  onBlur,
  onNavigate,
}) => {
  const [permission, requestPermission] = useCameraPermissions();

  const isPermissionGranted = Boolean(permission?.granted);

  return (
    <View style={style.container}>
      <FlowText type={"text7"} flowText={info} color={"#868686"} />
      <View style={style.dataContainer}>
        <TextInput
          value={data}
          onBlur={onBlur}
          onChangeText={onChangeText}
          style={style.input}
          placeholder={"................"}
          placeholderTextColor="#868686"
        />
        {info === "Device ID" && (
          <Pressable
            style={style.qrCodeButton}
            onPressIn={() => {
              requestPermission();

              if (isPermissionGranted) {
                console.log("Scan QR Code");
                onNavigate?.();
              } else {
                requestPermission();
              }
            }}
          >
            <FontAwesome name="qrcode" size={30} color="black" />
          </Pressable>
        )}
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
    paddingRight: 50,
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
  qrCodeButton: {
    // flexDirection: "row",
    // justifyContent: "flex-end",s
    // alignItems: "center",
    // marginRight: 20,
    // marginLeft: 10,
  },
});
