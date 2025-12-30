import React, { useEffect, useState } from 'react';
import { getCourses } from '../services/courses';
import CourseCard from '../components/CourseCard';
import { Container, Row, Col } from 'react-bootstrap';

const Home = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    getCourses()
      .then(res => setCourses(res.data.results || res.data))
      .catch(err => {
        console.error('Error loading courses:', err);
        setCourses([]);
      });
  }, []);

  return (
    <Container>
      <Row>
        {Array.isArray(courses) && courses.map(course => (
          <Col md={4} key={course.id}>
            <CourseCard course={course} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Home;
