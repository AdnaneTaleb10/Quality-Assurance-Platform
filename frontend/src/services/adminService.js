import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const getStats = async () => {
  const response = await api.get("/admin/stats");
  return response.data;
};

export const getAnswers = async (params = {}) => {
  const response = await api.get("/admin/answers", { params });
  return response.data;
};

export const validateAnswer = async (payload) => {
  const response = await api.post("/admin/validate", payload);
  return response.data;
};