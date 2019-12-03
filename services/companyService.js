import http from "./httpService";
import config from "../config.json";

// sending message
export function getAllCompanies() {
  return http.get(config.apiUrl + "/companies");
}
