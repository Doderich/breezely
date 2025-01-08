import React from "react";
import { View, Text, StyleProp, TextStyle, StyleSheet } from "react-native";

type Props = {
  flowText: string;
  type: "text1" | "text2" | "text3" | "text4" | "text5" | "text6" | "text7";
  color?: string;
  textUnderline?: boolean;
  numberOfLines?: number;
  styleProps?: StyleProp<TextStyle>;
};

const FlowText: React.FC<Props> = ({
  flowText,
  type,
  color,
  textUnderline = false,
  numberOfLines,
  styleProps,
}) => {
  const styleToApply = () => {
    switch (type) {
      case "text1":
        return style.text1;
      case "text2":
        return style.text2;
      case "text3":
        return style.text3;
      case "text4":
        return style.text4;
      case "text5":
        return style.text5;
      case "text6":
        return style.text6;
      case "text7":
        return style.text7;
      default:
        return style.text1;
    }
  };

  return (
    <View>
      <Text
        style={[
          styleToApply(),
          {
            ...(color && { color }),
            textDecorationLine: textUnderline ? "underline" : "none",
          },
          styleProps,
        ]}
        numberOfLines={numberOfLines}
      >
        {flowText}
      </Text>
    </View>
  );
};

export default FlowText;

const style = StyleSheet.create({
  text1: {
    fontFamily: "Inter",
    fontSize: 14,
    lineHeight: 19.5,
    fontWeight: "500",
    color: "#7F7F7C",
  },
  text2: {
    color: "#161846",
    fontFamily: "Inter",
    fontSize: 20,
    fontStyle: "normal",
    fontWeight: "600",
    lineHeight: 28,
  },
  text3: {
    color: "#8F8F8F",
    fontFamily: "Inter",
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "500",
    lineHeight: 19.5,
  },
  text4: {
    color: "#FFF",
    textAlign: "center",
    fontFamily: "Inter",
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: "800",
    lineHeight: 16.8,
  },
  text5: {
    fontFamily: "Inter",
    fontSize: 15,
    fontStyle: "normal",
    fontWeight: "700",
    lineHeight: 22,
  },
  text6: {
    color: '#9A9B9E',
    fontFamily: 'Inter',
    fontSize: 10,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 10,
    letterSpacing: -0.4,
  },
  text7: {
    fontFamily: 'Poppins',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 18.2,
  },
});
