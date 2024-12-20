import React, { useEffect, useState } from "react";
import { RouteProp } from "@react-navigation/native";
import { View, Text, StyleSheet } from "react-native";
import FlowText from "@/componets/flowText";
import InfoLabelEdit from "@/componets/infoLabelEdit";
import { Device, DeviceTypes } from "@/types/device";
import SaveButton from "@/componets/saveButton";
import { TabRoutes } from "@/navigation/Routes";
import { useCreateDevice, useDevice, useUpdateDevice } from "@/hooks/queries/useDevices";

export default function EditDevice({
  route,
  navigation,
}: {
  route: RouteProp<any, any>;
  navigation: any;
}) {
  const routeDevice = route.params?.device?.device;
  const title = route.params?.title;
  const {data: device} = useDevice(routeDevice?.id, {initialData: routeDevice ?? undefined});
  
  const {mutate: updateDevice} = useUpdateDevice();
  const {mutate: createDevice} = useCreateDevice();

  const [deviceId, setDeviceId] = useState(routeDevice?.device_id);
  const [deviceName, setDeviceName] = useState(routeDevice?.name);
  const [deviceType, setDeviceType] = useState(routeDevice?.type);
  const [deviceRoom, setDeviceRoom] = useState(routeDevice?.assigned_room);

  useEffect(() => {
    navigation.setOptions({ title: title });
  }, [navigation, route]);

  return (
    <View style={styles.container}>
      <FlowText flowText={"Info"} type="text3" styleProps={styles.infoText} />

      <View style={styles.deviceInfoDetails}>
        <InfoLabelEdit
          info="Device ID"
          data={deviceId ?? ""}
          onChangeText={(text) => setDeviceId(text)}
        />
        <InfoLabelEdit
          info="Device Name"
          data={deviceName ?? ""}
          onChangeText={(text) => setDeviceName(text)}
        />
        <InfoLabelEdit
          info="Device Type"
          data={DeviceTypes[deviceType as DeviceTypes]}
          onChangeText={(text) => setDeviceType(text)}
        />
        {/* <InfoLabelEdit
          info="Room"
          data={deviceRoom ?? ""}
          onChangeText={(text) => setDeviceRoom(text)}
        /> */}
      </View>
      <View style={styles.saveButtonContainer}>
        <SaveButton
          onPress={() => {
            if(deviceId && deviceName && deviceType) {
              console.log(device, device?.device.id, deviceId, deviceName, deviceType, deviceRoom);
              if(device?.device.id) {

                updateDevice({id: device.device.id, device_id: deviceId, name: deviceName, type: deviceType});
              } else {
                createDevice({device_id: deviceId, name: deviceName, type: deviceType});
              }
            }
            navigation.navigate(TabRoutes.App);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
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
  saveButtonContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 50,
    marginHorizontal: 20,
  },
});
