import React from "react";
import { Platform } from "react-native";
import { HeaderButton } from "react-navigation-header-buttons";
import { AntDesign } from "@expo/vector-icons";

import Color from "../constants/Color";

const NewHeaderButton = props => {
  return (
    <HeaderButton
      {...props}
      IconComponent={AntDesign}
      iconSize={23}
      color={Platform.OS === "android" ? "white" : Color.primaryColor}
    />
  );
};

export default NewHeaderButton;
