import { Status } from "@/constants/status";

export interface Category {
  id: number;
  name: string;
  description: string;
  status: Status;
  createdAt: string;
}
