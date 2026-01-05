import api from './api';


export const enrollCourse = (courseId) => {
    return api.post(`/courses/${courseId}/enroll/`);
};
export const checkEnrolled = (courseId) => api.get(`courses/${courseId}/is-enrolled/`);


export const getMyEnrollments = () => api.get('courses/enrollments/');
