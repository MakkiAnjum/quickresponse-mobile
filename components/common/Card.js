import React from "react";
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";

const Card = props => {
  const { card } = styles;

  return (
    <View style={{ ...card, ...props.style }}>
      <TouchableWithoutFeedback onPress={props.onPress}>
        {props.children}
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    // width: 300,
    // maxWidth: "80%",
    // alignItems: "center",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    backgroundColor: "white",
    padding: 20,
    elevation: 8,
    borderRadius: 10
  }
});

export default Card;
