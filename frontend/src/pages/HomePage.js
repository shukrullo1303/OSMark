import React, { useEffect, useState } from 'react';
import { getCourses } from '../services/courses';
import CourseCard from '../components/CourseCard';
import '../styles/pages/HomePage.css';

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getCourses()
      .then(res => {
        setCourses(res.data.results || res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading courses:', err);
        setCourses([]);
        setLoading(false);
      });
  }, []);

  const filteredCourses = searchQuery.trim()
    ? courses.filter(c =>
      c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : courses;

  return (
    <div className="site-container">
      <div className="hero">
        <h1>Learn anything, achieve everything</h1>
        <p>Explore thousands of courses and master new skills at your own pace.</p>
        <div className="search-bar">
          <input
            placeholder="Search courses, topics, or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="hero-search"
          />
        </div>
      </div>

      <div className="home-section">
        <div className="section-header">
          <h2>Recommended for you</h2>
          <p className="section-desc">Discover new opportunities to learn</p>
        </div>

        {loading ? (
          <div className="loading-state">
            <p>Loading courses...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="empty-state">
            <p>No courses found</p>
            {searchQuery && <p className="empty-desc">Try adjusting your search</p>}
          </div>
        ) : (
          <div className="course-grid">
            {filteredCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
