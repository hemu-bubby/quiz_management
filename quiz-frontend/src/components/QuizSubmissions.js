import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function QuizSubmissions() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    axios.get('http://127.0.0.1:8000/api/submissions/', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      const filtered = res.data.filter(s => s.quiz === parseInt(quizId));
      setSubmissions(filtered);
    });
  }, [quizId]);

  return (
    <div style={{ padding: '30px' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '20px' }}>⬅ Back</button>
      <h2>📊 Submissions for Quiz #{quizId}</h2>
      {submissions.length === 0 ? (
        <p>No submissions yet.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Student</th>
              <th>Score</th>
              <th>Submitted At</th>
              <th>Answers</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map(sub => (
              <tr key={sub.id}>
                <td>{sub.student_username}</td>
                <td>{sub.score}</td>
                <td>{new Date(sub.submitted_at).toLocaleString()}</td>
                <td>
                  <button onClick={() => navigate(`/submission/${sub.id}/answers`)}>
                    📄 View Answers
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default QuizSubmissions;
