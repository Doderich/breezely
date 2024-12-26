import React from "react";
import { View, Text, StyleSheet, Button, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FlowText from "@/componets/flowText";
import AddButton from "@/componets/addButton";
import { useRooms } from "@/hooks/queries/useRooms";
import ScreenTab from "@/componets/screenTab";

const rooms = [
  {
    id: "1",
    name: "Living Room",
    devices: [],
  },
  {
    id: "2",
    name: "Kitchen",
    devices: [],
  },
  {
    id: "3",
    name: "Bedroom",
    devices: [],
  },
  {
    id: "4",
    name: "Bathroom",
    devices: [],
  },
];

export default function Rooms({ navigation }: { navigation: any }) {
  // const { data: rooms, isLoading: isRoomsLoading } = useRooms();

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {/* <FlowText flowText={"Rooms"} type={"header1"} /> */}
        <FlowText
          flowText={"The list of all your Rooms"}
          type={"text5"}
          color={"#888888"}
        />
        <AddButton onPress={() => {}} />
      </View>
      <View style={styles.roomsContainer}>
        <FlatList
          horizontal={false}
          showsHorizontalScrollIndicator={false}
          data={rooms}
          contentContainerStyle={{ paddingHorizontal: 8 }}
          ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
          renderItem={({ item }) => (
            <ScreenTab
              title={item.name}
              onPress={() => {
                navigation.navigate("Room", { room: item });
              }}
            />
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    justifyContent: "flex-start",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 15,
    marginVertical: 30,
  },
  roomsContainer: {},
});
