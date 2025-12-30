import api from './api';

// Kategoriyalar
export const getCategories = () => api.get('courses/categories/');

// Kategoriya bo'yicha kurslar
export const getCategory = (id) => api.get(`courses/categories/${id}/`);

// Kurslar ro'yxati
export const getCourses = () => api.get('courses/courses/');

// Kurs detali
export const getCourse = (id) => api.get(`courses/courses/${id}/`);

// Enrollments
export const getEnrollments = () => api.get('courses/enrollments/');
