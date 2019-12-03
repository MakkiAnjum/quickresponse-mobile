import http from "./httpService";
import config from "../config.json";

// creating new complainer
export function AddNewComplainer(data) {
  return http.post(config.apiUrl + "/complainers", data);
}

// getting user information
export function getUserInfo(userId, role) {
  if (role === "assignee")
    return http.get(config.apiUrl + "/assignees/" + userId);
  if (role === "admin") return http.get(config.apiUrl + "/admins/" + userId);
  if (role === "complainer")
    return http.get(config.apiUrl + "/complainers/" + userId);
}

//profile update
export function updateUser(userId, userData, role) {
  if (role === "assignee")
    return http.put(config.apiUrl + "/assignees/" + userId, userData);
  if (role === "admin")
    return http.put(config.apiUrl + "/admins/" + userId, userData);
  if (role === "complainer")
    return http.put(config.apiUrl + "/complainers/" + userId, userData);
}

// recover password
export function recoverPassword(body) {
  return http.post(`${config.apiUrl}/password/recover`, body);
}

// reset password
export function resetPassword(body) {
  return http.put(`${config.apiUrl}/password/reset`, body);
}
