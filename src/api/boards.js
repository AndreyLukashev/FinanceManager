import { API_URLS } from "../constants/api-urls";
import { apiService } from "../services/Api";

export const createBoardApi = (userId, data) => {
  return apiService.post(`${userId}/${API_URLS.boards}`, data);
};

export const getBoardsApi = (userId) => {
  return apiService.get(`${userId}/${API_URLS.boards}`);
};

export const deleteBoardApi = (userId, boardId) => {
  return apiService.delete(`${userId}/${API_URLS.boards}/${boardId}`);
};