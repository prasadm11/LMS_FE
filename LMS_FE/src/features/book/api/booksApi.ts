import axiosInstance from "../../../api/axiosInstance";
import { API_ENDPOINTS } from "../../../api/endpoints";

export const getAllBooks = async () => {
    const result = await axiosInstance.get(API_ENDPOINTS.BOOKS.GET_ALL_BOOKS)
    return result;
}
export const getBookById = async (id: any) => {
  const result = await axiosInstance.get(`${API_ENDPOINTS.BOOKS.GET_BOOK_BY_ID}${id}`);
  return result;
};

export const addBook = async (obj: any) => {
  const result = await axiosInstance.post(`${API_ENDPOINTS.BOOKS.ADD_BOOK}` , obj);
  return result;
};

export const updateBook = async (obj: any) => {
  const result = await axiosInstance.put(`${API_ENDPOINTS.BOOKS.UPDATE_BOOK}` , obj);
  return result;
};

export const deleteBook = async (id: any) => {
  const result = await axiosInstance.delete(`${API_ENDPOINTS.BOOKS.DELETE_BOOK}/${id}`);
  return result;
};