import { Status } from "@/constants/status";

export interface Brand {
  id: number;
  name: string;
  status: Status;
  createdAt: string;
}
