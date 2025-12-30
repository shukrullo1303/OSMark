import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const LessonCard = ({ lesson }) => (
    <Card className="mb-2">
        <Card.Body className="d-flex justify-content-between align-items-center">
            <div>
                <Card.Title className="mb-0">{lesson.title}</Card.Title>
                <small className="text-muted">{lesson.duration || ''}</small>
            </div>
            <Button as={Link} to={`/lessons/${lesson.id}`} variant="outline-primary">Open</Button>
        </Card.Body>
    </Card>
);

export default LessonCard;
