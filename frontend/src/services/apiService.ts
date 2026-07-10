import axios from "axios";
import type { Product } from "../store/cartStore";

export interface Category {
  id: number;
  title: string;
  itemCount: number;
  image: string;
  badge: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const api = axios.create({
  baseURL: "/",
});

// Response interceptor to manage global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Axios API Error Interceptor:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message || error,
    });
    return Promise.reject(error);
  }
);

export const apiService = {
  async getCategories(): Promise<Category[]> {
    const response = await api.get<ApiResponse<Category[]>>("/api/categories");
    return response.data.data;
  },

  async getProducts(): Promise<Product[]> {
    const response = await api.get<ApiResponse<Product[]>>("/api/products");
    return response.data.data;
  },
};
