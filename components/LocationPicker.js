import React, { useState } from "react";
import {
  Button,
  TouchableWithoutFeedback,
  View,
  Text,
  Image,
  ActivityIndicator,
  Alert,
  StyleSheet
} from "react-native";

// import Geolocation from "react-native-geolocation-service";
import { MaterialIcons } from "@expo/vector-icons";
import * as Permissions from "expo-permissions";

import Color from "../constants/Color";

const LocationPicker = props => {
  const [isFetching, setIsFetching] = useState(false);
  const [pickedLocation, setPickedLocation] = useState();

  const verifyPermissions = async () => {
    const result = await Permissions.askAsync(Permissions.LOCATION);
    if (result.status !== "granted") {
      Alert.alert("You need to grant location permissions", [{ text: "Okay" }]);
      return false;
    }
    return true;
  };

  handleGetLocation = async () => {
    const hasPermissions = await verifyPermissions();
    if (!hasPermissions) {
      return;
    }

    setIsFetching(true);
    navigator.geolocation.getCurrentPosition(
      position => {
        setPickedLocation(position);
        props.onLocationTaken(position);
      },
      err => console.log(err),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 10000 }
    );
    //   setPickedLocation(null);

    setIsFetching(false);
  };

  return (
    <View style={styles.locationPicker}>
      <View style={{ position: "relative" }}>
        <TouchableWithoutFeedback onPress={handleGetLocation}>
          <Image source={require("../assets/map.jpg")} style={styles.image} />
        </TouchableWithoutFeedback>
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            padding: 5
          }}
        >
          <Text style={{ fontSize: 14, color: "#808080" }}>GPS Location</Text>
        </View>

        <View
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            marginLeft: -12
          }}
        >
          <MaterialIcons
            name="gps-fixed"
            size={24}
            color={Color.primaryColor}
            onPress={handleGetLocation}
          />
        </View>

        <View
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            padding: 5
          }}
        >
          {pickedLocation && (
            <View style={{ flexDirection: "column" }}>
              <View>
                <View style={{ marginBottom: 15 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#808080",
                      fontWeight: "600"
                    }}
                  >
                    Latitude
                  </Text>
                  <Text style={{ fontSize: 14, color: "#808080" }}>
                    {pickedLocation.coords.latitude}
                  </Text>
                </View>

                <View>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#808080",
                      fontWeight: "600"
                    }}
                  >
                    Longitude
                  </Text>
                  <Text style={{ fontSize: 14, color: "#808080" }}>
                    {pickedLocation.coords.longitude}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  locationPicker: { marginBottom: 15 },

  image: {
    width: "100%",
    height: 100,
    opacity: 0.5
  }
});

export default LocationPicker;
