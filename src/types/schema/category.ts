import { Status } from "@/constants/status";

export interface Category {
  id: number;
  name: string;
  description: string;
  status: Status;
  createdAt: string;
}

export interface CategoryUpdate {
  description: string;
  id: number;
  name: string;
}
