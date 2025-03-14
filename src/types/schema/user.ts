import { Status } from "@/constants/status";

export interface User {
  token: string;
  roleName: string;
  accountId: number;
  name: string;
  createAt: string;
  email: string;
  phoneNumber: string;
  status: Status;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterStaffData {
  address: string;
  email: string;
  name: string;
  password: string;
  phoneNumber: string;
  positionId: number;
}

export interface RegisterUserData {
  address: string;
  email: string;
  name: string;
  password: string;
  phoneNumber: string;
}

export interface UpdateAccountData {
  address: string;
  email: string;
  phoneNumber: string;
  name: string;
  id: number;
}

export interface Account {
  address: string;
  email: string;
  phoneNumber: string;
  name: string;
  id: number;
  createAt: string;
  status: Status;
}
