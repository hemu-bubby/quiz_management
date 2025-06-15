import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function StudentAnswerReview() {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    axios.get('http://127.0.0.1:8000/api/answers/', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      const filtered = res.data.filter(ans => ans.submission === parseInt(submissionId));
      setAnswers(filtered);
    }).catch(err => {
      console.error('Error loading answers:', err);
    });
  }, [submissionId]);

  return (
    <div style={{ padding: '30px' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '20px' }}>⬅ Back</button>
      <h2>📄 Your Answers</h2>
      {answers.length === 0 ? (
        <p>No answers found.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {answers.map((ans, index) => {
            const isCorrect = ans.answer_text.trim().toLowerCase() === ans.correct_answer.trim().toLowerCase();
            return (
              <li key={ans.id} style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '10px' }}>
                <p><strong>Q{index + 1}:</strong> {ans.question_text}</p>
                <p><strong>Your Answer:</strong> {ans.answer_text}</p>
                <p>
                  <strong>Result:</strong>{' '}
                  <span style={{ color: isCorrect ? 'green' : 'red' }}>
                    {isCorrect ? '✅ Correct' : '❌ Wrong'}
                  </span>
                </p>
                {!isCorrect && (
                  <p><strong>Correct Answer:</strong> {ans.correct_answer}</p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default StudentAnswerReview;
