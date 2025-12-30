import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCourse } from '../services/courses';
import { getLessonsByCourse } from '../services/lessons';
import LessonCard from '../components/LessonCard';
import { Row, Col, Button } from 'react-bootstrap';
import { enrollCourse } from '../services/enrollments';

const CoursePage = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [enrolled, setEnrolled] = useState(false);

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
                setLessons(res2.data);
            } catch (e) {
                setLessons([]);
            }
        };
        load();
    }, [id]);

    const handleEnroll = async () => {
        try {
            await enrollCourse(id);
            setEnrolled(true);
        } catch (err) {
            console.error(err);
        }
    };

    if (!course) return <div>Loading...</div>;

    return (
        <Row>
            <Col md={8}>
                <h2>{course.title}</h2>
                <p>{course.description}</p>
            </Col>
            <Col md={4}>
                <div className="mb-3">
                    <strong>{course.is_free ? 'Free' : `Price: ${course.price}`}</strong>
                </div>
                <div>
                    {!enrolled && <Button onClick={handleEnroll}>Enroll</Button>}
                    {enrolled && <small className="text-success">Enrolled</small>}
                </div>
            </Col>
            <Col md={12} className="mt-4">
                <h4>Lessons</h4>
                {lessons.map((l) => (
                    <LessonCard key={l.id} lesson={l} />
                ))}
            </Col>
        </Row>
    );
};

export default CoursePage;
