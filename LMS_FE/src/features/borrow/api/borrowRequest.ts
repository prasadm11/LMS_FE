import axiosInstance from "../../../api/axiosInstance";
import { API_ENDPOINTS } from "../../../api/endpoints";


export const createBorrowRequest = async (data: any) => {
  return await axiosInstance.post(API_ENDPOINTS.BORROW_REQUEST.CREATE_BORROW_REQUEST, data);
};


export const getAllPendingRequests = async () => {
  return await axiosInstance.get(API_ENDPOINTS.BORROW_REQUEST.GET_ALL_PENDING);
};


export const approveRequest = async (id: number) => {
  return await axiosInstance.post(
    `${API_ENDPOINTS.BORROW_REQUEST.APPROVE_REQUEST}?id=${id}`
  );
};


export const rejectRequest = async (id: number) => {
  return await axiosInstance.post(
    `${API_ENDPOINTS.BORROW_REQUEST.REJECT_REQUEST}?id=${id}`
  );
};


export const createReturnRequest = async (data: any) => {
  return await axiosInstance.post(API_ENDPOINTS.BORROW_REQUEST.CREATE_RETURN_REQUEST, data);
};


export const createRenewRequest = async (data: any) => {
  return await axiosInstance.post(API_ENDPOINTS.BORROW_REQUEST.CREATE_RENEW_REQUEST, data);
};