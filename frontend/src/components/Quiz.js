import React, { useState } from 'react';
import AnswerOption from './AnswerOption';
import './Quiz.css';

const Quiz = ({ quiz, onSubmit, submitting }) => {
    const [answers, setAnswers] = useState({});
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const total = quiz.questions?.length || 0;

    const handleChange = (questionId, optionId, multiple) => {
        setAnswers((prev) => {
            const current = prev[questionId] || [];
            if (multiple) {
                if (current.includes(optionId)) {
                    return { ...prev, [questionId]: current.filter((o) => o !== optionId) };
                }
                return { ...prev, [questionId]: [...current, optionId] };
            }
            return { ...prev, [questionId]: [optionId] };
        });
    };

    const submit = () => {
        onSubmit(answers);
    };

    const goNext = () => {
        if (currentQuestion < total - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const goPrev = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    if (!quiz.questions || quiz.questions.length === 0) {
        return <div className="empty-state">No questions available</div>;
    }

    const question = quiz.questions[currentQuestion];
    const answered = Object.keys(answers).length;

    return (
        <div className="quiz-wrapper">
            <div className="quiz-progress">
                <div className="progress-info">
                    <span className="progress-text">Question {currentQuestion + 1} of {total}</span>
                    <span className="progress-status">{answered} answered</span>
                </div>
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${((currentQuestion + 1) / total) * 100}%` }}></div>
                </div>
            </div>

            <div className="quiz-content">
                <div className="question-card">
                    <div className="question-header">
                        <span className="question-number">Question {currentQuestion + 1}</span>
                        {question.is_multiple && <span className="question-type">Multiple Select</span>}
                    </div>
                    <h3 className="question-text">{question.text}</h3>

                    <div className="options-list">
                        {question.options?.map((opt) => (
                            <AnswerOption
                                key={opt.id}
                                option={opt}
                                checked={(answers[question.id] || []).includes(opt.id)}
                                onChange={() => handleChange(question.id, opt.id, question.is_multiple)}
                            />
                        ))}
                    </div>
                </div>

                <div className="quiz-navigation">
                    <button
                        onClick={goPrev}
                        disabled={currentQuestion === 0}
                        className="btn btn-outline-primary"
                    >
                        ← Previous
                    </button>

                    {currentQuestion < total - 1 ? (
                        <button
                            onClick={goNext}
                            className="btn btn-outline-primary"
                        >
                            Next →
                        </button>
                    ) : (
                        <button
                            onClick={submit}
                            disabled={submitting}
                            className="btn btn-primary"
                        >
                            {submitting ? 'Submitting...' : 'Submit Quiz'}
                        </button>
                    )}
                </div>
            </div>

            <div className="quiz-sidebar">
                <div className="questions-overview">
                    <h4>Questions</h4>
                    <div className="question-grid">
                        {quiz.questions.map((q, idx) => (
                            <button
                                key={q.id}
                                onClick={() => setCurrentQuestion(idx)}
                                className={`question-btn ${idx === currentQuestion ? 'active' : ''} ${answers[q.id] ? 'answered' : ''}`}
                                title={`Question ${idx + 1}`}
                            >
                                {idx + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Quiz;
