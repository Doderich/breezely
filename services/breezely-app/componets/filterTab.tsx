import React, { useRef, useState } from "react";

import { Pressable, Text, StyleSheet } from "react-native";
import FlowText from "./flowText";

type Props = {
  isActive?: boolean;
  tabId: string;
  title: string;
  onPress: (tabId: string) => void;
};

const FilterTab: React.FC<Props> = ({
  isActive = false,
  tabId,
  title,
  onPress = () => {},
}) => {
  return (
    <Pressable
      style={[style.tab, isActive ? style.isActiveTab : style.isInactiveTab]}
      onPress={() => {
        onPress(tabId);
      }}
    >
      <FlowText
        type={"text1"}
        styleProps={isActive ? style.isActiveTitle : style.isInactiveTitle}
        flowText={title}
      />
    </Pressable>
  );
};

export default FilterTab;

const style = StyleSheet.create({
  tab: {
    marginVertical: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    width: "auto",
    alignSelf: "flex-start",
    borderRadius: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  isActiveTab: {
    backgroundColor: "#1F204A",
  },
  isInactiveTab: {
    backgroundColor: "#fff",
  },
  isActiveTitle: {
    color: "#fff",
  },
  isInactiveTitle: {
    color: "#8F8F8F",
  },
});
