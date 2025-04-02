import { OrderStatus } from "@/constants/status";
import { Product } from "./product";

export interface OrderData {
  accountId: number;
  address: string;
  listProducts: {
    productId: number;
    quantity: number;
  }[];
  phoneNumber: string;
}

export interface OrderProduct {
  id: number;
  createAt: string;
  quantity: number;
  status: string;
  price: number;
  productResponse: Product;
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
}

export interface OrderHistorySteps {
  id: number;
  createAt: string;
  description: string;
  status: OrderStatus;
}
