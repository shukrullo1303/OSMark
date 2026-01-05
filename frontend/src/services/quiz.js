import api from "./api";

// quizId orqali javob yuborish
export const submitQuiz = (quizId, answers) =>
    api.post(`/quiz/${quizId}/submit/`, { answers });

// quizId orqali quizni olish
export const getQuiz = (quizId) =>
    api.get(`/lessons/${quizId}/quiz/`);
