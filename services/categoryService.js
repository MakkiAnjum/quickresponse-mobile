import http from "./httpService";
import config from "../config.json";

export function getCategories() {
  return http.get(config.apiUrl + "/categories/all");
}

export function getAssigneeCategories() {
  return http.get(config.apiUrl + "/categories/assignee/allCategories/all");
}

export function getSpecificCategories() {
  return http.get(config.apiUrl + "/categories/assignee");
}

// getting categories for selection with no parent
export function getCategoriesWithNoParent() {
  return http.get(config.apiUrl + "/categories/specific/noparent");
}

// getting categories for selection with no parent
export function getCategoriesWithParent(categoryId) {
  return http.get(config.apiUrl + `/categories/specific/parent/${categoryId}`);
}

// getting categories for selection with no parent
export function getSentimentCategory(details) {
  return http.post(config.apiUrl + `/categories/sentiment/selection`, details);
}

// getting categories for selection with no parent
export function getParentCategory(categoryId) {
  return http.get(
    config.apiUrl + `/categories/find/parent/category/${categoryId}`
  );
}

export function getSiblingsOf(categoryId) {
  return http.get(config.apiUrl + "/categories/siblingsOf/" + categoryId);
}

export function getChildsOf(categoryId) {
  return http.get(config.apiUrl + "/categories/childsOf/" + categoryId);
}
export function getCategoryById(categoryId) {
  return http.get(config.apiUrl + "/categories/" + categoryId);
}

export function updateCategoryById(categoryId, body) {
  return http.put(config.apiUrl + "/categories/" + categoryId, body);
}

export function createCategory(body) {
  return http.post(config.apiUrl + "/categories/", body);
}
export function deleteCategory(id) {
  return http.delete(config.apiUrl + "/categories/" + id);
}
