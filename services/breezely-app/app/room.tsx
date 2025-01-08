import AddButton from "@/componets/addButton";
import DeviceView from "@/componets/deviceView";
import FlowText from "@/componets/flowText";
import { useDevices } from "@/hooks/queries/useDevices";
import { useDeleteRoom, useRoom } from "@/hooks/queries/useRooms";
import { StackRoutes } from "@/navigation/Routes";
import Feather from "@expo/vector-icons/Feather";
import { NavigationState } from "@react-navigation/native";
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
  const {mutate: deleteRoom, isError} = useDeleteRoom();
  useEffect(() => {
    // Set the title from the passed param
    navigation.setOptions({
      title: room?.name,
      headerRight: () => (
        <View style={styles.roomActions}>
          <Pressable onPressIn={() => {
            console.log("Delete room");
            if(!room) return;
            deleteRoom(parseInt(room.id));
            navigation.navigate(StackRoutes.Rooms);
          }}>
            <Feather name="trash-2" size={24} color="red" />
          </Pressable>
          <Pressable onPressIn={() => {
            console.log("Edit room");
            navigation.navigate(StackRoutes.EditRoom, {room});
          }}>
            <Feather name="edit" size={24} color="black" />
          </Pressable>
        </View>
      ),
    });
  }, [navigation, route]);

  console.log(room);
  return (
    <View style={styles.container}>
      <FlatList
        horizontal={false}
        showsVerticalScrollIndicator={false}
        data={room?.devices ?? []}
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
});
