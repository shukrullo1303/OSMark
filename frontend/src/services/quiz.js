import api from './api';

export const getQuiz = (id) => api.get(`quiz/quizzes/${id}/`);

export const submitQuiz = (id, answers) =>
    api.post(`quiz/quizzes/${id}/submit/`, { answers });

export const getResults = (quizId) => api.get(`quiz/results/?quiz=${quizId}`);
