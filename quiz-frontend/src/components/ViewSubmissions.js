import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

function ViewSubmissions() {
  const { quizId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    axios.get('http://127.0.0.1:8000/api/submissions/', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      const filtered = res.data.filter(s => s.quiz === parseInt(quizId));
      setSubmissions(filtered);
      setLoading(false);
    })
    .catch(err => {
      console.error('Error loading submissions:', err);
      setLoading(false);
    });
  }, [quizId]);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: '30px' }}>
      <h2>📋 Submissions for Quiz #{quizId}</h2>
      {submissions.length === 0 ? (
        <p>No students have attempted this quiz yet.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: '100%', textAlign: 'left' }}>
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Score</th>
              <th>Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((s) => (
              <tr key={s.id}>
                <td>
  {s.student}
  <br />
  <Link to={`/submission/${s.id}/answers`} style={{ fontSize: '14px' }}>
    📄 View Answers
  </Link>
</td>

                <td>{s.score}</td>
                <td>{new Date(s.submitted_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <br />
      <Link to="/faculty-dashboard">🔙 Back to Dashboard</Link>
    </div>
  );
}

export default ViewSubmissions;
