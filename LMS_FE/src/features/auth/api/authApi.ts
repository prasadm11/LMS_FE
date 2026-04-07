import axiosInstance from "../../../api/axiosInstance";

export const loginUser = async (data: {
  email: any;
  password: any;
}) => {
  const response = await axiosInstance.post("/Auth/LoginUser", data);
  return response.data;
};