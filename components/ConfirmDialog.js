import React from "react";
import { View } from "react-native";
import Dialog from "react-native-dialog";

const ConfirmDialog = props => {
  return (
    <View>
      <Dialog.Container visible={props.visible}>
        <Dialog.Title>Are you sure?</Dialog.Title>
        {props.children ? (
          <Dialog.Description>{props.children}</Dialog.Description>
        ) : null}
        <Dialog.Button label="Cancel" onPress={props.onCancelPress} />
        <Dialog.Button label="Confirm" onPress={props.onConfirmPress} />
      </Dialog.Container>
    </View>
  );
};

export default ConfirmDialog;
