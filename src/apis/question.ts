import { QuestionCreate, Question } from "@/types/schema/question";
import apiClient from "./client";

export const BASE_PATH = "/question";

const createQuestion = async (data: QuestionCreate) => {
  const response = await apiClient.post(BASE_PATH + "/create", data);
  return response.data;
};
const getQuestions = async (): Promise<Question[]> => {
  const response = await apiClient.get(BASE_PATH + "/getAll");
  return response.data.data;
};

export { createQuestion, getQuestions };
