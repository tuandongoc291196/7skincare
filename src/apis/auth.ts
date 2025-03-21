import { LoginData, RegisterStaffData, RegisterUserData } from "@/types/schema/user";
import axios from "axios";
import apiClient from "./client";

export const BASE_URL = import.meta.env.VITE_API_URL + "/auth";

const login = async (data: LoginData) => {
  const response = await axios.post(BASE_URL + "/login", data);
  return response.data;
};

const registerUser = async (data: RegisterUserData) => {
  const response = await axios.post(BASE_URL + "/register/user", data);
  return response.data;
};

const registerStaff = async (data: RegisterStaffData) => {
  const response = await apiClient.post(BASE_URL + "/register/staff", data);
  return response.data;
};

export { login, registerUser, registerStaff };
