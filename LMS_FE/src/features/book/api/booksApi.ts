import axiosInstance from "../../../api/axiosInstance";
import { API_ENDPOINTS } from "../../../api/endpoints";

export const getAllBooks = async () => {
    const result = await axiosInstance.get(API_ENDPOINTS.BOOKS.GET_ALL_BOOKS)
    return result;

}