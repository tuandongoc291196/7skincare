import { Status } from "@/constants/status";

export interface Position {
  id: number;
  name: string;
  status: Status;
  createdAt: string;
}
