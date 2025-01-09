import React, { useRef, useState } from "react";
import { CameraView } from "expo-camera";
import {
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { StackRoutes } from "@/navigation/Routes";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function qrScan({ navigation }: { navigation: any }) {
  const cameraRef = useRef<CameraView>(null);
  const [isActive, setIsActive] = useState(true);
  return (
    <SafeAreaView style={styleSheet.container}>
      {/* {Platform.OS === "android" ? <StatusBar hidden /> : null} */}

      <Pressable
        style={styleSheet.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={24} color="black" />
      </Pressable>
      <CameraView
        ref={cameraRef}
        active={isActive}
        style={styleSheet.camStyle}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={({ data }) => {
          setIsActive(false);
          navigation.navigate(StackRoutes.EditDevice, {
            title: "Add Device",
            qrCodeDeviceId: data,
            backTitle: "App",
          });
        }}
      />
    </SafeAreaView>
  );
}

const styleSheet = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    rowGap: 20,
  },
  camStyle: {
    position: "absolute",
    width: 300,
    height: 300,
  },
  backButton: {
    position: "absolute",
    top: 70,
    left: 30,
  },
});
