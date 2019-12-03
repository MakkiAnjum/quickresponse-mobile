import http from "./httpService";
import config from "../config.json";

// sending message
export function sendMessage(data) {
  return http.post(config.apiUrl + "/messages", data);
}

// getting all messages

export function getAllMessages(data) {
  return http.post(config.apiUrl + "/messages/all", data);
}

// deleting conversation
export function deleteConversation(data) {
  return http.post(config.apiUrl + "/messages/delete", data);
}

// get all notifications
export function getAllNotifications() {
  return http.get(config.apiUrl + "/notifications/getnotifications");
}
