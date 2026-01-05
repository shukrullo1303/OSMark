import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getLesson, getLessonsByCourse, markProgress } from "../services/lessons";
import "../styles/pages/LessonDetailPage.css";

const LessonDetailPage = () => {
  const { id, courseId } = useParams(); // id = lesson id, courseId = course id
  const { user } = useAuth();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  // Lesson detail va course lessons ni yuklash
  useEffect(() => {
    const loadLesson = async () => {
      try {
        const resLesson = await getLesson(id, user?.token);
        setLesson(resLesson.data);

        // Shu course dagi barcha lessons
        if (courseId) {
          const resCourse = await getLessonsByCourse(courseId, user?.token);
          setLessons(Array.isArray(resCourse.data) ? resCourse.data : resCourse.data.results || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadLesson();
  }, [id, courseId, user?.token]);

  if (loading) return <div className="site-container">Loading lesson...</div>;
  if (!lesson) return <div className="site-container">Lesson not found</div>;

  // Lessonni tugatish
  const handleComplete = async () => {
    if (!user) return;
    setCompleting(true);
    try {
      await markProgress(lesson.id, { completed: true });
      // lesson state yangilash
      setLesson(prev => ({ ...prev, is_completed: true }));
    } catch (err) {
      console.error(err);
    } finally {
      setCompleting(false);
    }
  };

  // Keyingi lessonni topish
  const nextLesson = lessons
    .filter(l => !l.is_locked)
    .sort((a, b) => a.order - b.order)
    .find(l => l.order > lesson.order);

  return (
    <div className="site-container lesson-detail">
      <h2>{lesson.title}</h2>
      <p>Lesson {lesson.order}</p>

      {/* Video */}
      {lesson.video_url && !lesson.is_locked && (
        <div style={{ width: "100%", maxHeight: "80vh", margin: "20px 0" }}>
          <video
            src={lesson.video_url}
            controls
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              borderRadius: "8px",
            }}
          />
        </div>
      )}

      {/* Tugmalar */}
      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        {!lesson.is_completed && !lesson.has_quiz && (
          <button className="btn btn-primary" onClick={handleComplete} disabled={completing}>
            {completing ? "Completing..." : "Mark as Complete"}
          </button>
        )}

        {lesson.has_quiz && !lesson.is_completed && (
          <button className="btn btn-success" onClick={() => navigate(`/lessons/${lesson.id}/quiz`)}>
            Go to Quiz
          </button>
        )}

        {/* Keyingi lessonga o‘tish */}
        {lesson.is_completed && nextLesson && (
          <button className="btn btn-primary" onClick={() => navigate(`/lessons/${nextLesson.id}`)}>
            Next Lesson: {nextLesson.title}
          </button>
        )}
      </div>
    </div>
  );
};

export default LessonDetailPage;
