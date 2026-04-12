import axiosInstance from "../../../api/axiosInstance";
import { API_ENDPOINTS } from "../../../api/endpoints";

export const getAllBooks = async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.BOOKS.GET_ALL_BOOKS)
    return response;
}
export const getBookById = async (id: any) => {
  const response = await axiosInstance.get(`${API_ENDPOINTS.BOOKS.GET_BOOK_BY_ID}${id}`);
  return response;
};

export const addBook = async (data: any) => {
  const response = await axiosInstance.post(`${API_ENDPOINTS.BOOKS.ADD_BOOK}` , data);
  return response;
};

export const updateBook = async (data: any) => {
  const response = await axiosInstance.put(`${API_ENDPOINTS.BOOKS.UPDATE_BOOK}` , data);
  return response;
};

export const deleteBook = async (id: any) => {
  const response = await axiosInstance.delete(`${API_ENDPOINTS.BOOKS.DELETE_BOOK}/${id}`);
  return response;
};