import jwtDecode from "jwt-decode";
import http from "./httpService";
// import AsyncStorage from "@react-native-community/async-storage";
import { AsyncStorage } from "react-native";

import { apiUrl } from "../config.json";

const tokenKey = "token";

getJwt()
  .then(token => {
    http.setJwt(token);
  })
  .catch(err => console.log("Err"));

export function login(email, password, companyId, apiEndpoint) {
  const Endpoint = apiUrl + apiEndpoint;

  return http.post(Endpoint, {
    email,
    password,
    companyId
  });
}

export async function logout() {
  await AsyncStorage.removeItem(tokenKey);
}

export async function getCurrentUser() {
  try {
    const jwt = await AsyncStorage.getItem(tokenKey);
    return jwtDecode(jwt);
  } catch (ex) {
    // window.location = '/login';
  }
}

export async function getJwt() {
  return await AsyncStorage.getItem(tokenKey);
}

export default {
  login,
  logout,
  getCurrentUser,
  getJwt
};
