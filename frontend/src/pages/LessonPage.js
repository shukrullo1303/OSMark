import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getLesson, markProgress } from '../services/lessons';
import { Button } from 'react-bootstrap';

const LessonPage = () => {
    const { id } = useParams();
    const [lesson, setLesson] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await getLesson(id);
                setLesson(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        load();
    }, [id]);

    const handleComplete = async () => {
        try {
            await markProgress(id, { completed: true });
            // optionally navigate to next lesson or show success
        } catch (err) {
            console.error(err);
        }
    };

    if (!lesson) return <div>Loading...</div>;

    return (
        <div>
            <h2>{lesson.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
            <div className="mt-3">
                <Button onClick={handleComplete} className="me-2">Mark Complete</Button>
                {lesson.quiz && <Button as={Link} to={`/quiz/${lesson.quiz}`} variant="outline-primary">Take Quiz</Button>}
            </div>
        </div>
    );
};

export default LessonPage;
