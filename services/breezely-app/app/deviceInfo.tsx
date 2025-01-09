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
import RoomTab from "@/componets/roomTab";
import { useRooms } from "@/hooks/queries/useRooms";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const dataColor = "#75A7F7";
const iconColor = "#9A9B9E";

export default function DeviceInfo({
  route,
  navigation,
}: {
  route: RouteProp<any, any>;
  navigation: any;
}) {
  const routeDevice = route.params?.device as Device;
  const {
    data: device,
    isLoading,
    isError,
  } = useDevice(routeDevice.device.id, {
    initialData: routeDevice ?? undefined,
  });
  const { mutate: deleteDevice, error } = useDeleteDevice();
  const { data: rooms } = useRooms();

  const deleteDeviceCb = () =>
    Alert.alert(
      "Delete Device",
      "Are you sure you want to delete this device?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
        },
        {
          text: "Delete",
          onPress: async () => {
            if (!device) return;
            deleteDevice(device?.device.id);
            navigation.navigate(TabRoutes.App);
          },
        },
      ]
    );

  return (
    <View style={style.container}>
      <View style={style.deviceInfo}>
        {device && <DeviceInfoLabel device={device} />}
        <View style={style.deviceInfoActions}>
          <Pressable
            onPress={() => {
              navigation.navigate(StackRoutes.EditDevice, {
                device: device,
              });
            }}
          >
            <Feather name="edit" size={24} color="black" />
          </Pressable>
          <Pressable onPress={deleteDeviceCb}>
            <Feather name="trash-2" size={24} color="red" />
          </Pressable>
        </View>
      </View>
      <FlowText flowText={"Info"} type="text3" styleProps={style.infoText} />

      {device && (
        <View style={style.deviceInfoDetails}>
          {/* <InfoLabel info="Device ID" data={device?.device?.device_id} /> */}
          <InfoLabel info="Device Name" data={device?.device?.name} />
          <View style={style.dataContainer}>
            <View style={style.dataItemsWrapper}>
              <View style={style.dataItemContainer}>
                <FontAwesome5
                  name={
                    device?.telemetry?.window_status[0]?.value === "true"
                      ? "unlock"
                      : "lock"
                  }
                  size={22}
                  color={iconColor}
                />
                <FlowText
                  type={"text5"}
                  flowText={
                    device?.telemetry?.window_status[0]?.value === "true"
                      ? "open"
                      : "closed"
                  }
                  color={dataColor}
                />
              </View>
              <View style={style.dataItemContainer}>
                <FontAwesome5
                  name={"temperature-high"}
                  size={22}
                  color={iconColor}
                />
                <FlowText
                  type={"text5"}
                  flowText={`${device.telemetry.temperature[0].value}°`}
                  color={dataColor}
                />
              </View>
              <View style={style.dataItemContainer}>
                <FontAwesome6 name="droplet" size={22} color={iconColor} />
                <FlowText
                  type={"text5"}
                  flowText={`${device.telemetry.humidity[0].value}%`}
                  color={dataColor}
                />
              </View>
            </View>
            <RoomTab
              room={
                rooms?.find((room) => room.id === device.device.assigned_room)
                  ?.name ?? "No Room"
              }
            />
          </View>
          {/* <InfoLabel info="Device Type" data={DeviceTypes[device?.device?.type]} /> */}
          {/* <InfoLabel info="Room" data={device?.device?.assigned_room} /> */}
          {/* <InfoLabel info="Created Date" data={device.createdAt} /> */}
        </View>
      )}
    </View>
  );
}

const style = StyleSheet.create({
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
  dataContainer: {
    marginTop: 18,
    marginBottom: 24,
    marginLeft: 16,
    marginRight: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dataItemsWrapper: {
    flexDirection: "row",
    columnGap: 8,
  },
  dataItemContainer: {
    flexDirection: "row",
    alignSelf: "flex-start",
    columnGap: 6,
  },
});
