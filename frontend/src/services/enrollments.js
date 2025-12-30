import api from './api';

export const enrollCourse = (courseId) => api.post(`courses/enrollments/`, { course: courseId });

export const getMyEnrollments = () => api.get('courses/enrollments/');
