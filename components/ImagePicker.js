import React, { useState } from "react";
import { encode, decode } from "base64-arraybuffer";
import { StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import * as FileSystem from "expo-file-system";
import { TouchableOpacity } from "react-native-gesture-handler";

const ImgPicker = props => {
  const [pickedImage, setPickedImage] = useState();

  const verifyPermissions = async () => {
    const result = await Permissions.askAsync(
      Permissions.CAMERA,
      Permissions.CAMERA_ROLL
      // Permissions.``
    );
    if (result.status !== "granted") {
      Alert.alert("You need to grant permissions", [{ text: "Okay" }]);
      return false;
    }
    return true;
  };

  const handleImagePicker = async () => {
    const hasPermissions = await verifyPermissions();
    if (!hasPermissions) {
      return;
    }

    let image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      base64: true
    });

    console.log(image);

    const filename = image.uri.split("/").pop();
    const newPath = FileSystem.documentDirectory + filename;

    FileSystem.writeAsStringAsync(image.uri);

    setPickedImage(image);
    props.onImageTaken(image);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.imagePicker}
      onPress={handleImagePicker}
    >
      {/* <View style={styles.imagePreview}>
        {!pickedImage ? (
          <Text>No Image picked yet.</Text>
        ) : (
          //   <Image style={styles.image} source={{ uri: pickedImage }} />
          <Text> Hye </Text>
        )}
      </View> */}
      {props.children}
      {/* <Button
        title="Pick File"
        color={Color.primaryColor}
        onPress={handleImagePicker}
      /> */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  imagePicker: {
    alignItems: "center",
    marginBottom: 15
  },
  imagePreview: {
    width: "100%",
    height: 10,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1
  },
  image: {
    width: "100%",
    height: "100%"
  }
});

export default ImgPicker;
