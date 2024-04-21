import { API_URLS } from "../constants/api-urls";
import { apiService } from "../services/Api";

export const createProfitApi = (userId, data) => {
  return apiService.post(`${userId}/${API_URLS.profit}`, data);
};

export const createExpenseApi = (userId, data) => {
  return apiService.post(`${userId}/${API_URLS.expense}`, data);
};

export const getProfitApi = (userId) => {
  return apiService.get(`${userId}/${API_URLS.profit}`);
};

export const getExpenseApi = (userId) => {
  return apiService.get(`${userId}/${API_URLS.expense}`);
};

export const deleteProfitApi = (userId, boardId) => {
  return apiService.delete(`${userId}/${API_URLS.profit}/${boardId}`);
};

export const deleteExpenseApi = (userId, boardId) => {
  return apiService.delete(`${userId}/${API_URLS.expense}/${boardId}`);
};