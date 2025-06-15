import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

function StudentResult() {
  const { submissionId } = useParams();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    axios.get(`http://127.0.0.1:8000/api/submissions/${submissionId}/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      setSubmission(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.error('Error fetching result:', err);
      setLoading(false);
    });
  }, [submissionId]);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: '30px', maxWidth: '500px', margin: 'auto' }}>
      <h2>📊 Quiz Result</h2>
      <p><strong>Quiz:</strong> #{submission.quiz}</p>
      <p><strong>Score:</strong> {submission.score}</p>
      <p><strong>Submitted At:</strong> {new Date(submission.submitted_at).toLocaleString()}</p>
      <br />
      <Link to="/student-dashboard">🔙 Back to Dashboard</Link>
    </div>
  );
}

export default StudentResult;
