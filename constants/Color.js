import { Platform } from "react-native";

export default {
  primaryColor: "#b65599",
  accentColor: "#16a28f",
  buttonColor: Platform.OS === "android" ? "#b65599" : "white",
  secondaryButtonColor: Platform.OS === "android" ? "#16a28f" : "white"
};
