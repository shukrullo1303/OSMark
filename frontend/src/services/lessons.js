import api from './api';

export const getLessonsByCourse = (courseId, token) =>
    api.get(`/courses/${courseId}/lessons/`, { headers: { Authorization: `Bearer ${token}` } });

export const getLesson = (id, token) =>
    api.get(`/lessons/${id}/`, { headers: { Authorization: `Bearer ${token}` } });

export const markProgress = (lessonId, payload, token) =>
    api.post(`/lessons/lesson_progress/${lessonId}/`, payload, { headers: { Authorization: `Bearer ${token}` } });
