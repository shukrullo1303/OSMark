import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuiz, submitQuiz } from '../services/quiz';
import Quiz from '../components/Quiz';
import { getUserQuizResult } from '../services/quiz';
import '../styles/pages/QuizPage.css';

const QuizPage = () => {
    const { id } = useParams();     // quiz id
    const navigate = useNavigate();

    const [quiz, setQuiz] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);



    useEffect(() => {
        const loadQuiz = async () => {
            try {
                const res = await getQuiz(id);   // /api/quiz/:id/
                setQuiz(res.data);
                  const resultRes = await getUserQuizResult(id); // /api/quiz/:id/user_results/
                  setResult(resultRes.data);

            } catch (err) {
                console.error('Quiz load error:', err);
            } finally {
                setLoading(false);
            }
        };

        loadQuiz();
    }, [id]);

    const handleSubmit = async (answers) => {
        setSubmitting(true);
        try {
            const res = await submitQuiz(quiz.id, answers);   // <-- MUHIM
            setResult(res.data);
        } catch (err) {
            console.error('Submit error:', err);
        } finally {
            setSubmitting(false);
        }
    };


    if (loading) return <div className="site-container">Loading quiz...</div>;
    if (!quiz) return <div className="site-container">Quiz not found</div>;

    const passingScore = parseFloat(quiz.passing_score);
    const passed = result && result.score >= passingScore;

    return (
        <div className="site-container quiz-page">
            <h1>{quiz.title}</h1>

            {!result ? (
                <Quiz quiz={quiz} onSubmit={handleSubmit} submitting={submitting} />
            ) : (
                <div className="quiz-result">
                    <h2>{passed ? 'Passed' : 'Failed'}</h2>
                    <p><b>Score:</b> {result.score}%</p>
                    <p>
                        <b>Correct:</b> {result.correct_answers} / {quiz.questions.length}
                    </p>

                    <div className="quiz-result-actions">
                        {passed && (
                            <button
                                className="btn btn-success"
                                onClick={() => navigate(`/lessons/${quiz.lesson}`)}
                            >
                                Back to Lesson
                            </button>
                        )}

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
