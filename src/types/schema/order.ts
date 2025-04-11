import { OrderStatus, Status } from "@/constants/status";
import { Category } from "./category";
import { Brand } from "./brand";
import { Account } from "./user";

export interface OrderData {
  accountId: number;
  address: string;
  listProducts: {
    productDetailId: number;
    quantity: number;
  }[];
  phoneNumber: string;
}
export interface ProductDetailResponse {
  id: number;
  name: string;
  description: string;
  image: string;
  status: Status;
  createdAt: string;
  category: Category;
  brand: Brand;
  createdBy: string;
  suitableFor: string;
  effect: string;
  ingredient: string;
  instructionManual: string;
  productSpecifications: string;
  price: string;
  capacity: number;
}

export interface OrderProduct {
  id: number;
  createAt: string;
  quantity: number;
  status: string;
  price: number;
  productDetailResponse: ProductDetailResponse;
}
export interface Order {
  id: number;
  createAt: string;
  address: string;
  phoneNumber: string;
  totalPrice: number;
  status: OrderStatus;
  reason: string;
  listProducts: OrderProduct[];
  account: Account;
}

export interface OrderHistorySteps {
  id: number;
  createAt: string;
  description: string;
  status: OrderStatus;
}
