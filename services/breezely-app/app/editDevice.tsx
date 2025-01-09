
import React, { useEffect, useState } from "react";
import { RouteProp } from "@react-navigation/native";
import { View, Text, StyleSheet, Pressable } from "react-native";
import FlowText from "@/componets/flowText";
import InfoLabelEdit from "@/componets/infoLabelEdit";
import { Device, DeviceTypes } from "@/types/device";
import SaveButton from "@/componets/saveButton";
import { TabRoutes } from "@/navigation/Routes";
import {
  useCreateDevice,
  useDevice,
  useUpdateDevice,
} from "@/hooks/queries/useDevices";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { StackRoutes } from "@/navigation/Routes";
import { useCameraPermissions } from "expo-camera";
import { useUserInfo } from "@/hooks/queries/useUserInfo";

const schema = z.object({
  deviceId: z.string().nonempty(),
  deviceName: z.string().nonempty(),
  deviceType: z.enum(["Window", "Door"]),
});
export default function EditDevice({
  route,
  navigation,
}: {
  route: RouteProp<any, any>;
  navigation: any;
}) {
  const [permission, requestPermission] = useCameraPermissions();
  const {data: user} = useUserInfo()

  const isPermissionGranted = Boolean(permission?.granted);
  const routeDevice = route.params?.device?.device;
  const title = route.params?.title;
  const backTitle = route.params?.backTitle;
  const qrCodeDeviceId = route.params?.qrCodeDeviceId;
  const { data: device } = useDevice(routeDevice?.id, {
    initialData: routeDevice ?? undefined,
  });
  const { mutate: updateDevice } = useUpdateDevice();
  const { mutate: createDevice } = useCreateDevice(user);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      deviceId: qrCodeDeviceId ?? routeDevice?.device_id ?? "",
      deviceName: routeDevice?.name ?? "",
      deviceType: routeDevice?.type ?? "",
    },
  });
  const { handleSubmit } = form;
  useEffect(() => {
    navigation.setOptions({
      title: title,
      headerBackTitle: backTitle ?? "App",
    });
  }, [navigation, route]);
  const onSubmit = ({
    deviceId,
    deviceName,
    deviceType,
  }: z.infer<typeof schema>) => {
    if (device?.device.id) {
      updateDevice({
        id: device.device.id,
        device_id: deviceId,
        name: deviceName,
        type: deviceType,
      });
    } else {
      createDevice({ device_id: deviceId, name: deviceName, type: deviceType });
    }
    navigation.navigate(TabRoutes.App);
  };
  return (
    <View style={styles.container}>
      <FlowText flowText={"Info"} type="text3" styleProps={styles.infoText} />
      <View style={styles.deviceInfoDetails}>
        <Controller
          control={form.control}
          name="deviceId"
          render={({ field: { onChange, value } }) => (
            <InfoLabelEdit
              info="Device ID"
              data={value}
              onChangeText={onChange}
              onNavigate={() => {
                navigation.navigate(StackRoutes.QrScan);
              }}
            />
          )}
        />
        <Controller
          control={form.control}
          name="deviceName"
          render={({ field: { onChange, value } }) => (
            <InfoLabelEdit
              info="Device Name"
              data={value}
              onChangeText={onChange}
            />
          )}
        />
        <Controller
          control={form.control}
          name="deviceType"
          render={({ field: { onChange, value } }) => (
            <InfoLabelEdit
              info="Device Type"
              data={value}
              onChangeText={onChange}
            />
          )}
        />
      </View>
      <View style={styles.saveButtonContainer}>
        <SaveButton onPress={handleSubmit(onSubmit)} />
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
  containerLayout: {
    // minHeight: 128,
  },
});
