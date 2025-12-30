import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getLesson, markProgress } from '../services/lessons';
import './LessonPage.css';

const LessonPage = () => {
    const { id } = useParams();
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [completing, setCompleting] = useState(false);
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await getLesson(id);
                setLesson(res.data);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        };
        load();
    }, [id]);

    const handleComplete = async () => {
        setCompleting(true);
        try {
            await markProgress(id, { completed: true });
            setCompleted(true);
        } catch (err) {
            console.error(err);
        } finally {
            setCompleting(false);
        }
    };

    if (loading) {
        return <div className="site-container"><div className="loading-state">Loading lesson...</div></div>;
    }

    if (!lesson) {
        return <div className="site-container"><div className="empty-state">Lesson not found</div></div>;
    }

    return (
        <div className="site-container">
            <div className="breadcrumb">
                <Link to="/">Home</Link>
                <span>/</span>
                <Link to={`/courses/${lesson.course}`}>Course</Link>
                <span>/</span>
                <span>{lesson.title}</span>
            </div>

            <div className="lesson-layout sidebar">
                <main className="lesson-main">
                    <div className="lesson-header">
                        <h1>{lesson.title}</h1>
                        {completed && (
                            <div className="completion-badge">
                                <span>✓</span> Completed
                            </div>
                        )}
                    </div>

                    <div className="progress-indicator">
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: completed ? '100%' : '60%' }}></div>
                        </div>
                        <small className="progress-text">{completed ? '100%' : '60%'} complete</small>
                    </div>

                    <div className="lesson-content">
                        <div className="content-body">
                            {lesson.content ? (
                                <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
                            ) : (
                                <p>No content available for this lesson</p>
                            )}
                        </div>
                    </div>

                    <div className="lesson-actions">
                        <button
                            onClick={handleComplete}
                            className={`btn ${completed ? 'btn-secondary' : 'btn-primary'}`}
                            disabled={completed || completing}
                        >
                            {completing ? 'Marking...' : completed ? '✓ Completed' : 'Mark as Complete'}
                        </button>
                        {lesson.quiz && (
                            <Link to={`/quiz/${lesson.quiz}`} className="btn btn-outline-primary">
                                Take the quiz
                            </Link>
                        )}
                    </div>
                </main>

                <aside className="lesson-sidebar">
                    <div className="sidebar-card">
                        <h4>Lesson Details</h4>
                        <div className="detail-item">
                            <span className="detail-label">Difficulty</span>
                            <span className="detail-value">{lesson.difficulty || 'Beginner'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Duration</span>
                            <span className="detail-value">{lesson.duration || '15 mins'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Status</span>
                            <span className={`detail-badge ${completed ? 'completed' : 'pending'}`}>
                                {completed ? 'Completed' : 'In Progress'}
                            </span>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default LessonPage;
