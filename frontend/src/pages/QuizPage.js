import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getQuiz, submitQuiz } from '../services/quiz';
import Quiz from '../components/Quiz';

const QuizPage = () => {
    const { id } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [result, setResult] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await getQuiz(id);
                setQuiz(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        load();
    }, [id]);

    const handleSubmit = async (answers) => {
        try {
            const res = await submitQuiz(id, answers);
            setResult(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    if (!quiz) return <div>Loading...</div>;

    return (
        <div>
            <h2>{quiz.title}</h2>
            {!result ? <Quiz quiz={quiz} onSubmit={handleSubmit} /> : (
                <div>
                    <h4>Your Result</h4>
                    <pre>{JSON.stringify(result, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default QuizPage;
