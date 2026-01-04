import { Card, Button, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import "../styles/components/LessonCard.css"

const LessonCard = ({ lesson }) => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleOpen = () => {
        if (lesson.has_quiz) {
            navigate(`/lessons/${lesson.id}/quiz`);
        } else {
            navigate(`/lessons/${lesson.id}`);
        }
    };

    return (
        <Card className="mb-2">
            <Card.Body className="d-flex justify-content-between align-items-center">
                <div>
                    <Card.Title className="mb-0">{lesson.title}</Card.Title>
                    <small className="text-muted">{lesson.duration || ''}</small>
                </div>
                <Button
                    variant="outline-primary"
                    onClick={handleOpen}
                    disabled={lesson.is_locked} // locked darslarni ochmaslik
                >
                    {lesson.has_quiz ? "Quizga o'tish" : "Open"}
                </Button>
            </Card.Body>
        </Card>
    );
};

export default LessonCard;