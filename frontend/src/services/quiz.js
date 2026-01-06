import api from "./api";
import axios from "axios";

export const getQuiz = (id) => api.get(`/quiz/${id}/`);
export const submitQuiz = (id, answers) =>
    api.post(`/quiz/${id}/submit/`, { answers });


export const getUserQuizResult = async (quizId) => {
  const token = localStorage.getItem("access_token"); // JWT token

  if (!token) {
    console.error("No access token found");
    return null;
  }

  try {
    const res = await axios.get(
      `http://127.0.0.1:8000/api/quiz/${quizId}/user_results/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching user quiz result:", err.response || err);
    return null;
  }
};
