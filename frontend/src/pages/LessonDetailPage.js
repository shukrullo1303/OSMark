import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLesson, markLessonCompleted } from "../services/lessons";
import Quiz from "../components/Quiz"
import { getUserQuizResult } from "../services/quiz";
import "../styles/pages/LessonDetailPage.css";

export default function LessonDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLesson();
  }, [id]);

  const loadLesson = async () => {
    setLoading(true);
    try {
      const res = await getLesson(id);
      const lessonData = res.data;
      setLesson(lessonData);

      // Quiz natijasini olish, lessonData dan olamiz
      const quizId = lessonData.quizzes?.[0]?.id;
      if (quizId) {
        const resultRes = await getUserQuizResult(quizId);
        setResult(resultRes[0].score);
      }
    } catch (err) {
      console.error("Lesson load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const goNext = async () => {
    try {
      await markLessonCompleted(lesson.id); // 8000 port
      navigate(`/lessons/${lesson.next_lesson_id}`);
    } catch (err) {
      console.error("Mark complete error:", err);
    }
  };

  if (loading) return <div className="site-container">Loading...</div>;

  return (
    <div className="site-container lesson-detail-page">
      <h1>{lesson.title}</h1>

      {/* {lesson.video_url && (
        <video src={lesson.video_url} controls style={{ width: "100%", height: "70vh" }} />
      )} */}
      <div className="video-container">

        <iframe
          src={`https://www.youtube.com/embed/${lesson.video_url.split("youtu.be/")[1]}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>

      </div>


      {/* ================= QUIZ BLOCK ================= */}
      {lesson.quizzes && (
        <div className="quiz-box">
          {!result ? (
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/quiz/${lesson.quizzes[0].id}`)}
            >
              Take Quiz
            </button>
          ) :
            (
              <div>

                <button
                  className="btn btn-primary"
                  onClick={() => navigate(`/quiz/${lesson.quizzes[0].id}`)}
                >
                  Retake Quiz
                </button>
                <p>
                  your score is {result}
                </p>
              </div>
            )

          }

        </div>
      )
      }

      {/* ================= NAV ================= */}
      <div className="lesson-nav">
        {lesson.prev_lesson_id && (
          <button className="btn btn-outline-secondary"
            onClick={() => navigate(`/lessons/${lesson.prev_lesson_id}`)}>
            ← Prev Lesson
          </button>
        )}

        {lesson.next_lesson_id && (
          <button className="btn btn-success"
            disabled={!(result >= 80)}
            onClick={goNext}>
            Next Lesson →
          </button>
        )}
      </div>
    </div >
  );
}
