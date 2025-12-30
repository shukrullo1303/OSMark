import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getQuiz, submitQuiz } from '../services/quiz';
import Quiz from '../components/Quiz';
import './QuizPage.css';

const QuizPage = () => {
    const { id } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await getQuiz(id);
                setQuiz(res.data);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        };
        load();
    }, [id]);

    const handleSubmit = async (answers) => {
        setSubmitting(true);
        try {
            const res = await submitQuiz(id, answers);
            setResult(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="site-container"><div className="loading-state">Loading quiz...</div></div>;
    }

    if (!quiz) {
        return <div className="site-container"><div className="empty-state">Quiz not found</div></div>;
    }

    return (
        <div className="site-container">
            <div className="breadcrumb">
                <a href="/">Home</a>
                <span>/</span>
                <span>Quiz</span>
            </div>

            {!result ? (
                <div className="quiz-container">
                    <div className="quiz-header">
                        <h1>{quiz.title}</h1>
                        <p className="quiz-description">{quiz.description}</p>
                        <div className="quiz-meta">
                            <span className="meta-item">
                                <strong>{quiz.questions?.length || 0}</strong> Questions
                            </span>
                            <span className="meta-item">
                                <strong>Passing Score:</strong> {quiz.passing_score || 70}%
                            </span>
                        </div>
                    </div>
                    <Quiz quiz={quiz} onSubmit={handleSubmit} submitting={submitting} />
                </div>
            ) : (
                <div className="quiz-result">
                    <div className="result-card">
                        <div className={`result-badge ${result.score >= (quiz.passing_score || 70) ? 'passed' : 'failed'}`}>
                            {result.score >= (quiz.passing_score || 70) ? '✓' : '✗'}
                        </div>
                        <h2>{result.score >= (quiz.passing_score || 70) ? 'Quiz Passed!' : 'Quiz Completed'}</h2>
                        <div className="result-score">
                            <span className="score-value">{result.score}%</span>
                            <span className="score-label">Your Score</span>
                        </div>
                        <div className="result-details">
                            <div className="detail-row">
                                <span>Correct Answers</span>
                                <strong>{result.correct_answers || 0} / {quiz.questions?.length || 0}</strong>
                            </div>
                        </div>
                        <div className="result-actions">
                            <a href="/" className="btn btn-primary">Back to Home</a>
                            <button onClick={() => window.location.reload()} className="btn btn-outline-primary">
                                Retake Quiz
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuizPage;
