import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  return (
    <Card className="mb-3 h-100">
      <Card.Body className="d-flex flex-column">
        <Card.Title>{course.title}</Card.Title>
        <Card.Text className="flex-grow-1">{course.description}</Card.Text>
        <div className="d-flex justify-content-between align-items-center mt-2">
          <small>{course.is_free ? 'Free' : `Price: ${course.price}`}</small>
          <Button as={Link} to={`/courses/${course.id}`} variant="primary">View</Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CourseCard;
