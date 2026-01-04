import api from './api';

export const enrollCourse = (courseId) => api.post(`courses/${courseId}/enroll`);

export const getMyEnrollments = () => api.get('courses/enrollments/');
