import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCourse } from '../services/courses';
import { getLessonsByCourse } from '../services/lessons';
import LessonCard from '../components/LessonCard';
import { enrollCourse, checkEnrolled } from '../services/enrollments';
import { useAuth } from '../context/AuthContext';
import '../styles/pages/CoursePage.css';



const CoursePage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [enrolled, setEnrolled] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await getCourse(id);
                setCourse(res.data);
            } catch (err) {
                console.error(err);
            }

            try {
                const res2 = await getLessonsByCourse(id);
                setLessons(Array.isArray(res2.data) ? res2.data : res2.data.results || []);
            } catch (e) {
                setLessons([]);
            }

            // ENROLLED STATUSNI TEKSHIRISH
            if (user) {
                try {
                    const r = await checkEnrolled(id);
                    setEnrolled(r.data.enrolled);
                } catch (e) {
                    setEnrolled(false);
                }
            }

            setLoading(false);
        };
        load();
    }, [id, user]);


    const handleEnroll = async () => {
        try {
            await enrollCourse(course.id);
            alert("Successfully enrolled!");
            setEnrolled(true);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.detail || "Enroll failed");
        }
    };

    if (loading) return <div className="site-container"><div className="loading-state">Loading course...</div></div>;
    if (!course) return <div className="site-container"><div className="empty-state">Course not found</div></div>;

    return (
        <div className="site-container">
            <div className="breadcrumb">
                <Link to="/">Home</Link>
                <span>/</span>
                <span>{course.title}</span>
            </div>

            <div className="course-hero">
                <div className="course-hero-content">
                    <h1>{course.title}</h1>
                    <p className="course-subtitle">{course.subtitle || course.description?.slice(0, 120)}</p>
                    <div className="course-actions">
                        <div className="price-badge">{course.is_free ? 'Free' : `$${course.price}`}</div>
                        <button
                            onClick={handleEnroll}
                            className={`btn ${enrolled ? 'btn-secondary' : 'btn-primary'}`}
                            disabled={enrolled}
                        >
                            {enrolled ? '✓ Enrolled' : 'Enroll now'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="course-layout sidebar">
                <div className="course-main">
                    <section className="course-section">
                        <h2>About this course</h2>
                        <p className="course-description">
                            {course.description}
                        </p>
                    </section>

                    <section className="course-section">
                        <h2>Lessons ({lessons.length})</h2>
                        {lessons.length === 0 ? (
                            <div className="empty-state">No lessons yet</div>
                        ) : (
                            <div className="lesson-grid">
                                {lessons.map((l, idx) => (
                                    <LessonCard key={l.id} lesson={l} index={idx + 1} />
                                ))}

                            </div>
                        )}
                    </section>
                </div>

                <aside className="course-sidebar">
                    <div className="sidebar-card">
                        <h4>Course Details</h4>
                        <div className="detail-item">
                            <span className="detail-label">Instructor</span>
                            <span className="detail-value">{course.instructor_name || 'TBA'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Level</span>
                            <span className="detail-value">{course.level || 'All levels'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Lessons</span>
                            <span className="detail-value">{lessons.length}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Status</span>
                            <span className={`detail-badge ${enrolled ? 'enrolled' : 'available'}`}>
                                {enrolled ? 'Enrolled' : 'Available'}
                            </span>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default CoursePage;
