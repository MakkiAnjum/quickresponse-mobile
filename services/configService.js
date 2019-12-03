import http from "./httpService";
import config from "../config.json";
const endPoint = config.apiUrl + "/config/";

export function getConfiguration(id) {
  return http.get(endPoint + id);
}

export function deleteConfiguration(id) {
  return http.delete(endPoint + id);
}

export function addConfiguration(body) {
  return http.post(endPoint, body);
}

export function updateConfiguration(body, id) {
  return http.put(endPoint + id, body);
}
