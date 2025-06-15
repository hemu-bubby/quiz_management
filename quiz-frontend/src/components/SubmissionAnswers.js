import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function SubmissionAnswers() {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const fetchAnswers = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/answers/', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const submissionAnswers = res.data.filter(a => a.submission === parseInt(submissionId));
        setAnswers(submissionAnswers);
      } catch (err) {
        console.error('Error fetching answers:', err);
      }
    };

    fetchAnswers();
  }, [submissionId]);

  return (
    <div style={{ padding: '30px' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '20px' }}>⬅ Back</button>
      <h2>📄 Submission Answers</h2>

      {answers.length === 0 ? (
        <p>No answers found.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {answers.map((a, idx) => (
            <li key={a.id} style={{ marginBottom: '20px', backgroundColor: '#f7f7f7', padding: '10px', borderRadius: '8px' }}>
              <p><strong>Q{idx + 1}:</strong> {a.question_text}</p>
              <p>
                <strong>Answer:</strong> {a.answer_text}{" "}
                {a.answer_text.trim().toLowerCase() === a.correct_answer.trim().toLowerCase()
                  ? '✅'
                  : `❌ (Correct: ${a.correct_answer})`}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SubmissionAnswers;
