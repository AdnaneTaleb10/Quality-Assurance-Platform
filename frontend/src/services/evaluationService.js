// services/evaluationService.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

/** GET /api/evaluation/next → { next_question_id: number | null } */
export const getNextQuestion = async () => {
  const response = await api.get("/evaluation/next");
  return response.data;
};

/** GET /api/evaluation/:questionId */
export const getQuestion = async (questionId) => {
  const response = await api.get(`/evaluation/${questionId}`);
  return response.data;
};

/** POST /api/evaluation/submit (multipart/form-data) */
export const submitAnswer = async ({ questionId, answer, files }) => {
  const formData = new FormData();
  formData.append("question_id", questionId);
  formData.append("answer", answer);
  files.forEach((file, index) => formData.append(`file_${index}`, file));

  const response = await api.post("/evaluation/submit", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};