import axiosInstance from "../../../api/axiosInstance";
import { API_ENDPOINTS } from "../../../api/endpoints";

export const borrowBook = async (data: any) => {
    const response = await axiosInstance.post(`${API_ENDPOINTS.BORROW.BORROW_BOOK}`, data);
    return response;
}

export const returnBook = async (data: any) => {
    const response = await axiosInstance.post(API_ENDPOINTS.BORROW.RETURN_BOOK, data);
    return response;
}

export const getBooksByStatus = async (data: any) => {
    const response = await axiosInstance.get(`${API_ENDPOINTS.BORROW.GET_BOOK_BY_STATUS}?status=${data}`);
    return response;
}

export const getUserBorrowHistory = async (data: any) => {
    const response = await axiosInstance.get(`${API_ENDPOINTS.BORROW.GET_USER_BORROW_HISTORY}?UserId=${data}`);
    return response;
}

export const getOverdueBooks = async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.BORROW.GET_OVERDUE_BOOKS);
    return response;
}

export const renewBook = async (data: any) => {
    const response = await axiosInstance.post(API_ENDPOINTS.BORROW.RENEW_BOOK, data);
    return response;
}

export const searchBooks = async (data: any) => {
    const response = await axiosInstance.get(`${API_ENDPOINTS.BORROW.SEARCH_BOOKS}?Keyword=${data}`);
    return response;
}

export const getBorrowSummary = async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.BORROW.GET_BORROW_SUMMARY);
    return response;
}

export const checkBorrowEligibility = async (id: any) => {
    const response = await axiosInstance.get(`${API_ENDPOINTS.BORROW.CHECK_BORROW_ELIGIBLITY}?UserId=${id}`);
    return response;
}

export const payFine = async (data : any) => {
    const response = await axiosInstance.post(API_ENDPOINTS.BORROW.PAY_FINE, data);
    return response;
}

export const getDueBookSoon = async (data: any) => {
    const response = await axiosInstance.get(`${API_ENDPOINTS.BORROW.GET_DUEBOOK_SOON}?days=${data}`);
    return response;
}