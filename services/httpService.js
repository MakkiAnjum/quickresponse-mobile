import axios from "axios";
import { Alert } from "react-native";

axios.interceptors.response.use(null, error => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;
  if (!expectedError) {
    console.log("Loggin the error", error);
    Alert.alert("An unexpected error has occured.");
  }
  return Promise.reject(error);
});

function setJwt(jwt) {
  // calling protected endpoints
  axios.defaults.headers.common["x-auth-token"] = jwt;
}

export default {
  get: axios.get,
  put: axios.put,
  post: axios.post,
  delete: axios.delete,
  setJwt
};
