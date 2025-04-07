import { QuestionCreate, Question, QuestionUpdate } from "@/types/schema/question";
import apiClient from "./client";

export const BASE_PATH = "/question";

const createQuestion = async (data: QuestionCreate) => {
  const response = await apiClient.post(BASE_PATH + "/create", data);
  return response.data;
};
const getQuestions = async (): Promise<Question[]> => {
  const response = await apiClient.get(BASE_PATH + "/getAll", { params: { pageSize: 1000 } });
  return response.data.data;
};
const updateQuestion = async (data: QuestionUpdate) => {
  const response = await apiClient.put(BASE_PATH + "/edit/", data);
  return response.data;
};
const deleteQuestion = async (id: number) => {
  const response = await apiClient.delete(BASE_PATH + "/", { params: { id: id } });
  return response.data;
};
const getRandomQuestions = async (): Promise<Question[]> => {
  const response = await apiClient.get(BASE_PATH + "/getRandom");
  return response.data.data;
};
export { createQuestion, getQuestions, deleteQuestion, updateQuestion, getRandomQuestions };
