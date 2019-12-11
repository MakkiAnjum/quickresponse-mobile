import http from "./httpService";
import config from "../config.json";

export function getLocations() {
  return http.get(config.apiUrl + "/locations/all");
}

export function getAssigneelocations() {
  return http.get(config.apiUrl + "/locations/assignee/allLocations/all");
}

export function getSpecificlocations() {
  return http.get(config.apiUrl + "/locations/assignee");
}

// getting locations for selection with no parent
export function getlocationsWithNoParent() {
  return http.get(config.apiUrl + "/locations/specific/noparent");
}

// getting locations for selection with no parent
export function getlocationsWithParent(locationId) {
  return http.get(config.apiUrl + `/locations/specific/parent/${locationId}`);
}

// getting locations for selection with no parent
export function getSentimentLocation(details) {
  return http.post(config.apiUrl + `/locations/sentiment/selection`, details);
}

// getting locations for selection with no parent
export function getParentLocation(locationId) {
  return http.get(
    config.apiUrl + `/locations/find/parent/location/${locationId}`
  );
}

export function getSiblingsOf(locationId) {
  return http.get(config.apiUrl + "/locations/siblingsOf/" + locationId);
}

export function getChildsOf(locationId) {
  return http.get(config.apiUrl + "/locations/childsOf/" + locationId);
}
export function getLocationById(locationId) {
  return http.get(config.apiUrl + "/locations/" + locationId);
}

export function updateLocationById(locationId, body) {
  return http.put(config.apiUrl + "/locations/" + locationId, body);
}

export function createLocation(body) {
  return http.post(config.apiUrl + "/locations/", body);
}
export function deleteLocation(id) {
  return http.delete(config.apiUrl + "/locations/" + id);
}
