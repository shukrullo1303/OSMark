import api from './api';

export const getLessonsByCourse = (courseId) =>
    api.get(`lessons/courses/${courseId}/lessons/`);

export const getLesson = (id) => api.get(`lessons/lessons/${id}/`);

export const markProgress = (lessonId, payload) =>
    api.post(`lessons/progress/${lessonId}/`, payload);
