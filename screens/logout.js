import React, { useEffect } from "react";
import { View, Text, AsyncStorage } from "react-native";
import authService from "../services/authService";

const Logout = props => {
  const logout = async () => {
    await authService.logout();
    return props.navigation.navigate("Auth");
  };

  useEffect(() => {
    logout();
  }, []);

  return (
    <View>
      <Text></Text>
    </View>
  );
};

export default Logout;
