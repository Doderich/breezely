import React, { useRef, useState } from "react";

import { Image, Pressable, Text, View, StyleSheet } from "react-native";
import FlowText from "./flowText";
import Feather from "@expo/vector-icons/Feather";

type Props = {
  name: string;
  email: string;
  buttonText: string;
  onPress: () => void;
};

const ProfileTab: React.FC<Props> = ({
  name,
  email,
  buttonText,
  onPress = () => {},
}) => {
  //   const [width, setWidth] = useState(0);
  //   const textRef = useRef(null);
  //   const paddingHorizontal = 33;
  //   const tabWidth = {
  //     width: horizontalScale(paddingHorizontal * 2 + width),
  //   };
  return (
    <View style={style.container}>
        <View style={style.userInfoContainer}>
          <FlowText type={"text5"} flowText={name} color={"#fff"} />
          <FlowText flowText={email} type={"text3"} color={"#fff"} />
      </View>

      {/* <Pressable
        style={style.button}
        onPress={() => {
          onPress();
        }}
      >
        <FlowText
          flowText={buttonText}
          type={"text3"}
          color={"#fff"}
          styleProps={style.buttonText}
        />
        <Feather name="edit" size={24} color="white" />
      </Pressable> */}
    </View>
  );
};

export default ProfileTab;

const style = StyleSheet.create({
  container: {
    paddingHorizontal: 21,
    paddingVertical: 35,
    // marginHorizontal: 12,
    borderRadius: 20,
    // height: 180,
    // fill: linear-gradient(180deg, #D92D2D 0%, #B01212 100%);
    backgroundColor: "#1F204A",
    flexDirection: "row",
    justifyContent: "space-between",
  },
 
  button: {
    backgroundColor: 'rgba(128, 128, 128, 0.3)',
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
  },
  userInfoContainer: {
    marginBottom: 18,
  },
  buttonText: {
    marginRight: 5,
  },
});
