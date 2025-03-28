import { Blog, BlogCreate, BlogUpdate } from "@/types/schema/blog";
import apiClient from "./client";

export const BASE_PATH = "/blog";

const createBlog = async (data: BlogCreate) => {
  const response = await apiClient.post(BASE_PATH + "/create", data);
  return response.data;
};
const getBlogs = async (): Promise<Blog[]> => {
  const response = await apiClient.get(BASE_PATH + "/getAll");
  return response.data.data;
};
const updateBlog = async (data: BlogUpdate) => {
  const response = await apiClient.put(BASE_PATH + "/edit", data);
  return response.data;
};
const deleteBlog = async (id: number) => {
  const response = await apiClient.delete(BASE_PATH + "/delete/", { params: { id: id } });
  return response.data;
};
const getBlogById = async (id: number) => {
  const response = await apiClient.get(BASE_PATH + `/?id=${id}`);
  return response.data.data;
};
export { createBlog, getBlogs, updateBlog, deleteBlog, getBlogById };
