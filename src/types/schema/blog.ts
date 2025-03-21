import { Status } from "@/constants/status";

export interface BlogCreate {
  accountId: number;
  content: string;
  image: string;
  title: string;
}

export interface BlogUpdate {
  id: number;
  content: string;
  image: string;
  title: string;
}

export interface Blog {
  id: number;
  title: string;
  content: string;
  image: string;
  createdAt: string;
  status: Status;
  authorName: string;
}
