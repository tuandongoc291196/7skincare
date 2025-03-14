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
  product: Product;
}
export interface Order {
  id: number;
  createAt: string;
  address: string;
  phoneNumber: string;
  totalPrice: number;
  status: string;
  listProducts: OrderProduct[];
}
