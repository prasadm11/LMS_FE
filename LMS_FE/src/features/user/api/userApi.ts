import axiosInstance from "../../../api/axiosInstance";
import { API_ENDPOINTS } from "../../../api/endpoints";

export const getAllUsers = async () => {
  const response= await axiosInstance.get(API_ENDPOINTS.USER.GET_ALL_USERS);
  return response;
};

export const createUser = async (data: any) => {
  const response = await axiosInstance.post(API_ENDPOINTS.USER.CREATE_USER, data);
  return response;
};

export const updateUser = async (data: any) => {
  const response= await axiosInstance.put(API_ENDPOINTS.USER.UPDATE_USER, data);
  return response;
};

export const deleteUser = async (id: any) => {
  const response= await axiosInstance.delete(`${API_ENDPOINTS.USER.DELETE_USER}/${id}`);
  return response;
};

export const getUserById = async (id: number) => {
  const response= await axiosInstance.get(`${API_ENDPOINTS.USER.GET_USER_BY_ID}/${id}`);
  return response;
};