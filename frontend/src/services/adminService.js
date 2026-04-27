import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// ---------- Dashboard ----------
export const getStats = async () => {
  const response = await api.get("/admin/stats");
  return response.data;
};

// ---------- Validation queue ----------
export const getAnswers = async (params = {}) => {
  const response = await api.get("/admin/answers", { params });
  return response.data;
};

export const validateAnswer = async (payload) => {
  const response = await api.post("/admin/validate", payload);
  return response.data;
};

// ---------- Users ----------
export const getUsers = async (params = {}) => {
  const response = await api.get("/admin/users", { params });
  return response.data;
};

export const updateUserRole = async (userId, roleId) => {
  const response = await api.put(`/admin/users/${userId}/role`, { role_id: roleId });
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await api.delete(`/admin/users/${userId}`);
  return response.data;
};

// getRoles tries the admin endpoint first (when logged in as admin),
// then falls back to the public /roles endpoint (used on the signup page).
export const getRoles = async () => {
  try {
    const response = await api.get("/admin/roles");
    return response.data;
  } catch {
    const response = await api.get("/roles");
    return response.data;
  }
};

export const getUserSubmissions = async (userId) => {
  const response = await api.get(`/admin/users/${userId}/submissions`);
  return response.data;
};

// ---------- Per-user pending answers ----------
export const getUserPendingAnswers = async (userId) => {
  if (!userId) throw new Error("userId is required");
  const response = await api.get(`/admin/users/${userId}/answers/pending`);
  return response.data;
};

// ---------- Single answer review ----------
export const reviewAnswer = async ({ answer_id, status, comment = "" }) => {
  if (!answer_id) throw new Error("answer_id is required");
  const response = await api.post(`/admin/answers/${answer_id}/review`, {
    status,
    comment,
  });
  return response.data;
};

// ---------- Bulk validate a reference ----------
export const validateReference = async (userId, referenceId, payload) => {
  const response = await api.post(
    `/admin/users/${userId}/references/${referenceId}/validate`,
    payload
  );
  return response.data;
};