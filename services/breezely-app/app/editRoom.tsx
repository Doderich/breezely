import AddButton from "@/componets/addButton";
import DeviceView from "@/componets/deviceView";
import FlowText from "@/componets/flowText";
import { useDevices } from "@/hooks/queries/useDevices";
import { useCreateRoom, useRoom, useUpdateRoom } from "@/hooks/queries/useRooms";
import { StackRoutes } from "@/navigation/Routes";
import Feather from "@expo/vector-icons/Feather";
import React, { useEffect } from "react";
import { View, Text, StyleSheet, Button, Pressable, FlatList, TextInput } from "react-native";
import { Controller, useForm } from "react-hook-form"
import InfoLabelEdit from "@/componets/infoLabelEdit";
import MultiSelect from 'react-native-multiple-select';
import MultiSelectDropdown from "@/componets/mutiSelectDropdown";
import SaveButton from "@/componets/saveButton";



export default function CreateRoom({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const {data: room} = useRoom(parseInt(route.params?.room.id), {initialData: route.params?.room ?? undefined});
  const { data: devices } = useDevices();
  const {mutate: createRoom} = useCreateRoom();
  const {mutate: updateRoom} = useUpdateRoom();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<{name: string, devices: string[], id?: string}>(
    {
      defaultValues: {
        name: room?.name ?? "",
        devices: room?.devices.map(device => device.device.id.toString()) ?? [],
        id: room?.id,
      },
    }
  )

  const onSubmit = (data: {name: string, devices: string[], id?: string}) => {
    console.log(data);
    if(data.id){
      updateRoom({id: data.id, name: data.name, devices: data.devices.map(device => parseInt(device))});
    } else {
      createRoom({name: data.name, devices: data.devices.map(device => parseInt(device))});
    }
    navigation.navigate(StackRoutes.Rooms);
  }


  useEffect(() => {
    navigation.setOptions({
      title: room?.name,
    });
  }, [navigation, route]);

  console.log(room);
  return (
    <View style={styles.container}>
      <View style={styles.addDeviceContainer}>
      </View>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <InfoLabelEdit
          info="Name"
          data={value}
          onBlur={onBlur}
          onChangeText={onChange}
        />
        )}
        name="name"
      />
      {errors.name && <Text>This is required.</Text>}

      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <MultiSelectDropdown options={devices?.filter(device => !device.device.assigned_room || device.device.assigned_room.toString() === room?.id.toString() ).map(device => ({label: device.device.name, value: device.device.id.toString()})) ?? []} label="Devices" value={value} onChange={onChange} />
        )}
        name="devices"
      /> 
      <View style={styles.saveButtonContainer}>
      <SaveButton onPress={handleSubmit(onSubmit)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  roomActions: {
    flexDirection: "row",
    columnGap: 12,
  },
  addDeviceContainer: {
    marginHorizontal: 20,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  saveButtonContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 50,
    marginHorizontal: 20,
  },
});
