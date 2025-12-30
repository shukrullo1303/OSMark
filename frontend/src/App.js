import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/HomePage';
import CoursePage from './pages/CoursePage';
import LessonPage from './pages/LessonPage';
import QuizPage from './pages/QuizPage';
import Navigation from './components/Navbar';
import { Container } from 'react-bootstrap';

function App() {
  return (
    <Router>
      <Navigation />
      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses/:id" element={<CoursePage />} />
          <Route path="/lessons/:id" element={<LessonPage />} />
          <Route path="/quiz/:id" element={<QuizPage />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
