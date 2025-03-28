import { Status } from "@/constants/status";
import { Category } from "./category";
import { Brand } from "./brand";

export interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  quantity: number;
  status: Status;
  createdAt: string;
  category: Category;
  brand: Brand;
  createdBy: string;
  suitableFor: string;
}

export interface ProductCreate {
  accountId: number;
  brandId: number;
  categoryId: number;
  description: string;
  image: string;
  name: string;
  price: number;
  quantity: number;
  skinTypeId: number[];
}

export interface ProductUpdate {
  id: number;
  image: string;
  brandId: number;
  categoryId: number;
  description: string;
  name: string;
  price: number;
  quantity: number;
  skinTypeId: number[];
}
