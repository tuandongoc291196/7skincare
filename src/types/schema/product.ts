import { Status } from "@/constants/status";
import { Category } from "./category";
import { Brand } from "./brand";

export interface ProductDetails {
  id: number;
  price: number;
  quantity: number;
  capacity: string;
  createdAt: string;
  status: Status;
}
export interface Product {
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
  priceRange: string;
  noOfSold: number;
  productDetails: ProductDetails[];
}

export interface ProductCreate {
  accountId: number;
  brandId: number;
  categoryId: number;
  description: string;
  image: string;
  name: string;
  skinTypeId: number[];
  effect: string;
  ingredient: string;
  instructionManual: string;
  productSpecifications: string;
  productDetails: { price: number; quantity: number; capacity: string }[];
}

export interface ProductUpdate {
  id: number;
  image: string;
  brandId: number;
  categoryId: number;
  description: string;
  name: string;
  skinTypeId: number[];
  effect: string;
  ingredient: string;
  instructionManual: string;
  productSpecifications: string;
  productDetails: { id: number; price: number; quantity: number; capacity: string }[];
}
