import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuiz, submitQuiz } from '../services/quiz';
import Quiz from '../components/Quiz';
import '../styles/pages/QuizPage.css';

const QuizPage = () => {
    const { id } = useParams(); // lesson id
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const loadQuiz = async () => {
            try {
                const res = await getQuiz(id);
                // Backenddan array qaytadi, birinchi elementni oling
                setQuiz(res.data[0]);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadQuiz();
    }, [id]);
    const handleSubmit = async (answers) => {
        setSubmitting(true);
        try {
            const res = await submitQuiz(quiz.id, answers); // quiz.id yuboriladi
            setResult(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };


    if (loading) return <div className="site-container">Loading quiz...</div>;
    if (!quiz) return <div className="site-container">Quiz not found</div>;

    const passingScore = parseFloat(quiz.passing_score || 70);
    const passed = result && result.score >= passingScore;

    return (
        <div className="site-container">
            <h1>{quiz.title}</h1>

            {!result ? (
                <Quiz quiz={quiz} onSubmit={handleSubmit} submitting={submitting} />
            ) : (
                <div className="quiz-result">
                    <h2>{passed ? '✓ Passed!' : '✗ Failed'}</h2>
                    <p>Score: {result.score}%</p>
                    <p>Correct answers: {result.correct_answers} / {quiz.questions.length}</p>

                    <div className="quiz-result-actions" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        {/* Keyingi darsga otish */}
                        {passed && (
                            <button
                                className="btn btn-success"
                                onClick={() => navigate(`/lessons/${quiz.lesson + 1}`)}
                            >
                                Next Lesson
                            </button>
                        )}
                        {/* Oldingi darsga otish */}
                        <button
                            className="btn btn-outline-secondary"
                            onClick={() => navigate(`/lessons/${quiz.lesson - 1}`)}
                        >
                            Previous Lesson
                        </button>
                        {/* Retake Quiz */}
                        <button
                            className="btn btn-primary"
                            onClick={() => window.location.reload()}
                        >
                            Retake Quiz
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuizPage;
