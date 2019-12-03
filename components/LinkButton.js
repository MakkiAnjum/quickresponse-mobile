import React from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import Colors from "../constants/Color";

const LinkButton = props => {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={props.onPress}>
      <View style={{ ...styles.button, ...props.buttonContainer }}>
        <Text style={{ ...styles.buttonText, ...props.buttonTextContainer }}>
          {props.children}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white"
  },
  buttonText: {
    color: "white",
    fontFamily: "open-sans",
    color: "blue"
  }
});

export default LinkButton;
