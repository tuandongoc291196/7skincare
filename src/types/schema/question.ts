import { Status } from "@/constants/status";

export interface QuestionCreate {
  question: string;
  answers: {
    answer: string;
    point: number;
  }[];
}

export interface Question {
  id: number;
  question: string;
  createdAt: string;
  status: Status;
  listAnswers: Answer[];
}

export interface Answer {
  id: number;
  answer: string;
  point: number;
  createdAt: string;
  status: Status;
}
