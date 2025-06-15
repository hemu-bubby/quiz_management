import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function StudentAttempts() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAttempts = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/submissions/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAttempts(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching attempts:', error);
        setLoading(false);
      }
    };
    fetchAttempts();
  }, []);

  const handleBack = () => {
    navigate('/student-dashboard');
  };

  return (
    <div style={{ padding: '30px', maxWidth: '800px', margin: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>📜 Your Past Quiz Attempts</h2>
        <button
          onClick={handleBack}
          style={{ backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', padding: '8px 16px', cursor: 'pointer' }}
        >
          ⬅ Back
        </button>
      </div>

      {loading ? (
        <p>Loading attempts...</p>
      ) : attempts.length === 0 ? (
        <p>No attempts found.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {attempts.map((attempt) => (
            <li
              key={attempt.id}
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '15px',
                backgroundColor: '#f1f1f1'
              }}
            >
              <p><strong>Quiz:</strong> {attempt.quiz_title}</p>
              <p><strong>Score:</strong> {attempt.score}</p>
              <p><strong>Submitted At:</strong> {new Date(attempt.submitted_at).toLocaleString()}</p>
              <button
  onClick={() => navigate(`/submission/${attempt.id}/answers`)}
  style={{ marginTop: '10px', padding: '6px 10px' }}
>
  📖 View Answers
</button>

            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default StudentAttempts;
