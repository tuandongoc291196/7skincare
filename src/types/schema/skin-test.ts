import { Status } from "@/constants/status";
import { SkinType } from "./skin-type";
import { Account, User } from "./user";
import { Product } from "./product";

export interface QA {
  answerId: number;
  questionId: number;
}

export interface SkinTestData {
  accountId?: number;
  userTests: QA[];
}

export interface UserTestResponse {
  id: number;
  createdAt: string;
  status: Status;
  question: {
    id: number;
    createdAt: string;
    question: string;
    status: Status;
  };
  userAnswer: {
    id: number;
    createdAt: string;
    answer: string;
    point: number;
    status: Status;
  };
}
export interface SkinTestResult {
  id: number;
  createdAt: string;
  totalPoint: number;
  testTime: number;
  status: Status;
  maxPoint: number;
  userTestResponse: UserTestResponse[];
  skinType: SkinType;
  user: Account;
  suitableProducts: Product[];
}

export type UserTest = {
  id: number;
  createdAt: string;
  totalPoint: number;
  testTime: number;
  maxPoint: number;
  status: Status;
  skinType: SkinType;
  user: User;
};
