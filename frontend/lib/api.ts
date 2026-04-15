import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('aiml_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('aiml_token');
      localStorage.removeItem('aiml_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ─── Auth ────────────────────────────────────────────────────
export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// ─── Modules ─────────────────────────────────────────────────
export const modulesAPI = {
  getAll: () => api.get('/modules'),
  getById: (id: number | string) => api.get(`/modules/${id}`),
  getProgress: (id: number | string) => api.get(`/modules/${id}/progress`),
};

// ─── Quiz ─────────────────────────────────────────────────────
export const quizAPI = {
  getQuestions: (moduleId: number | string) =>
    api.get(`/modules/${moduleId}/questions`),
  submitQuiz: (
    moduleId: number | string,
    answers: { question_id: number; selected_answer: string }[]
  ) => api.post(`/modules/${moduleId}/quiz/submit`, { answers }),
};

// ─── User ─────────────────────────────────────────────────────
export const userAPI = {
  getProgress: () => api.get('/user/progress'),
  updateProgress: (data: { module_id: number; completed: boolean }) =>
    api.post('/user/progress', data),
  getScores: () => api.get('/user/scores'),
};

// ─── Playground ───────────────────────────────────────────────
export const playgroundAPI = {
  executeCode: (code: string) => api.post('/playground/execute', { code }),
};

export default api;
