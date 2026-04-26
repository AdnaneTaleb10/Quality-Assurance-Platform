// services/myAnswersService.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// GET /api/my-answers
// Returns { answers: [...] }
export const getMyAnswers = async () => {
  const res = await api.get("/my-answers");
  return res.data;
};