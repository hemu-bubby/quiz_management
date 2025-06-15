import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function StudentDashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      const token = localStorage.getItem('accessToken');

      try {
        const response = await axios.get('http://127.0.0.1:8000/api/quizzes/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setQuizzes(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const goToQuiz = (quizId) => {
    navigate(`/quiz/${quizId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/');
  };

  return (
    <div style={{ padding: '30px', maxWidth: '800px', margin: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>🎓 Student Dashboard</h2>
        <button onClick={handleLogout} style={{ height: '35px', padding: '5px 15px' }}>Logout</button>
      </div>

      <p>Welcome, student!</p>

      <Link to="/student-attempts" style={{ display: 'inline-block', marginBottom: '20px' }}>📜 View Past Attempts</Link>

      {loading ? (
        <p>Loading quizzes...</p>
      ) : (
        <div>
          {quizzes.length === 0 ? (
            <p>No quizzes available right now.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {quizzes.map((quiz) => (
                <li
                  key={quiz.id}
                  onClick={() => goToQuiz(quiz.id)}
                  style={{
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    padding: '15px',
                    marginBottom: '15px',
                    cursor: 'pointer',
                    backgroundColor: '#f9f9f9'
                  }}
                >
                  <h3>{quiz.title}</h3>
                  <p>{quiz.description}</p>
                  <p><strong>Date:</strong> {new Date(quiz.date).toLocaleString()}</p>
                  <p><strong>Time Limit:</strong> {quiz.time_limit} mins</p>
                  <p><strong>Attempts:</strong> {quiz.allow_multiple_attempts ? 'Multiple allowed' : 'Only one allowed'}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;
