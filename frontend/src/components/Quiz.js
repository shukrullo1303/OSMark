import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import AnswerOption from './AnswerOption';

const Quiz = ({ quiz, onSubmit }) => {
    const [answers, setAnswers] = useState({});

    const handleChange = (questionId, optionId, multiple) => {
        setAnswers((prev) => {
            const current = prev[questionId] || [];
            if (multiple) {
                if (current.includes(optionId)) return { ...prev, [questionId]: current.filter((o) => o !== optionId) };
                return { ...prev, [questionId]: [...current, optionId] };
            }
            return { ...prev, [questionId]: [optionId] };
        });
    };

    const submit = () => {
        onSubmit(answers);
    };

    return (
        <div>
            {quiz.questions.map((q) => (
                <Card key={q.id} className="mb-3">
                    <Card.Body>
                        <Card.Title>{q.text}</Card.Title>
                        {q.options.map((opt) => (
                            <AnswerOption
                                key={opt.id}
                                option={opt}
                                checked={(answers[q.id] || []).includes(opt.id)}
                                onChange={() => handleChange(q.id, opt.id, q.is_multiple)}
                            />
                        ))}
                    </Card.Body>
                </Card>
            ))}
            <Button onClick={submit}>Submit</Button>
        </div>
    );
};

export default Quiz;
