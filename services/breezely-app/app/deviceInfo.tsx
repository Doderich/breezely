import React, { useEffect } from "react";
import { RouteProp } from "@react-navigation/native";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import InfoLabel from "@/componets/infoLabel";
import DeviceInfoLabel from "@/componets/deviceInfoLabel";
import Feather from "@expo/vector-icons/Feather";
import FlowText from "@/componets/flowText";
import { StackRoutes, TabRoutes } from "@/navigation/Routes";
import { Device, DeviceTypes } from "@/types/device";
import { useDeleteDevice, useDevice } from "@/hooks/queries/useDevices";

export default function DeviceInfo({
  route,
  navigation,
}: {
  route: RouteProp<any, any>;
  navigation: any;
}) {
  const routeDevice = route.params?.device as Device;
  const {data: device, isLoading, isError} = useDevice(routeDevice.device.id, {initialData: routeDevice ?? undefined});
  const {mutate: deleteDevice , error} = useDeleteDevice();

  const deleteDeviceCb = () =>
    Alert.alert("Delete Device", "Are you sure you want to delete this device?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
      },
      {
        text: "Delete",
        onPress: async () => {
          if(!device) return; 
          deleteDevice(device?.device.id);
          navigation.navigate(TabRoutes.App);
        },
      },
    ]);

  return (
    <View style={styles.container}>
      <View style={styles.deviceInfo}>
        {device && <DeviceInfoLabel device={device} />}
        <View style={styles.deviceInfoActions}>
          <Pressable
            onPress={() => {
              navigation.navigate(StackRoutes.EditDevice, {
                device: device,
              });
            }}
          >
            <Feather name="edit" size={24} color="black" />
          </Pressable>
          <Pressable
            onPress={deleteDeviceCb}
          >
            <Feather name="trash-2" size={24} color="red" />
          </Pressable>
        </View>
      </View>
      <FlowText flowText={"Info"} type="text3" styleProps={styles.infoText} />
      
      {device && <View style={styles.deviceInfoDetails}>
        <InfoLabel info="Device ID" data={device?.device?.device_id} />
        <InfoLabel info="Device Name" data={device?.device?.name} />
        {/* <InfoLabel info="Device Type" data={DeviceTypes[device?.device?.type]} /> */}
        {/* <InfoLabel info="Room" data={device?.device?.assigned_room} /> */}
        {/* <InfoLabel info="Created Date" data={device.createdAt} /> */}
      </View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    alignItems: "stretch",
    justifyContent: "flex-start",
    width: "100%",
    padding: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  heading: {
    padding: 5,
    fontSize: 24,
  },
  text: {
    padding: 5,
    fontSize: 14,
  },
  error: {
    color: "red",
  },
  deviceInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginRight: 24,
  },
  deviceInfoActions: {
    flexDirection: "row",
    columnGap: 12,
  },
  deviceInfoDetails: {
    rowGap: 6,
    marginHorizontal: 20,
  },
  infoText: {
    marginHorizontal: 22,
    marginTop: 20,
    marginBottom: 8,
  },
});
