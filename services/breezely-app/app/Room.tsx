import AddButton from "@/componets/addButton";
import DeviceView from "@/componets/deviceView";
import FlowText from "@/componets/flowText";
import { useDevices } from "@/hooks/queries/useDevices";
import { useRoom } from "@/hooks/queries/useRooms";
import { StackRoutes } from "@/navigation/Routes";
import { Room } from "@/types/rooms";
import Feather from "@expo/vector-icons/Feather";
import React, { useEffect } from "react";
import { View, Text, StyleSheet, Button, Pressable, FlatList } from "react-native";

export default function Room({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const {data: room, isLoading: isLoadingRoom} = useRoom(parseInt(route.params?.room.id), {initialData: route.params?.room ?? undefined});
  const { data: devices, isLoading: isLoadingDevices } = useDevices();

  useEffect(() => {
    // Set the title from the passed param
    navigation.setOptions({
      title: room?.name,
      headerRight: () => (
        <View style={styles.roomActions}>
          <Pressable onPress={() => {}}>
            <Feather name="trash-2" size={24} color="red" />
          </Pressable>
          <Pressable onPress={() => {}}>
            <Feather name="edit" size={24} color="black" />
          </Pressable>
        </View>
      ),
    });
  }, [navigation, route]);

  console.log(room);
  return (
    <View style={styles.container}>
      <View style={styles.addDeviceContainer}>
        <FlowText flowText={"Devices"} type="text3" />
        <AddButton
          onPress={() => {
            navigation.navigate(StackRoutes.EditDevice, {
              title: "Add Device",
            });
          }}
        />
      </View>
      <FlatList
        horizontal={false}
        showsVerticalScrollIndicator={false}
        data={devices ?? []}
        contentContainerStyle={{ paddingVertical: 8 }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => (
          <DeviceView
            device={item}
            onPress={() => {
              console.log(item);
              navigation.navigate(StackRoutes.DeviceInfo, {
                device: item,
              });
            }}
          />
        )}
      />
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
});
