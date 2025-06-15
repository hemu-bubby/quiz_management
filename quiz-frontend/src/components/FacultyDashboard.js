import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function FacultyDashboard() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time_limit: '',
    allow_multiple_attempts: false,
  });
  const [message, setMessage] = useState('');
  const [quizzes, setQuizzes] = useState([]);
  const [editingQuizId, setEditingQuizId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/quizzes/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setQuizzes(res.data);
    } catch (error) {
      console.error('Failed to fetch quizzes:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const token = localStorage.getItem('accessToken');

    try {
      if (editingQuizId) {
        await axios.put(`http://127.0.0.1:8000/api/quizzes/${editingQuizId}/`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage('✅ Quiz updated successfully!');
      } else {
        const response = await axios.post('http://127.0.0.1:8000/api/quizzes/', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const createdQuizId = response.data.id;
        setMessage('✅ Quiz created successfully!');
        navigate(`/quiz/${createdQuizId}/add-question`);
      }
      setFormData({ title: '', description: '', date: '', time_limit: '', allow_multiple_attempts: false });
      setEditingQuizId(null);
      fetchQuizzes();
    } catch (error) {
      console.error('Error:', error);
      setMessage('❌ Failed to submit quiz.');
    }
  };

  const handleEdit = (quiz) => {
    setFormData({
      title: quiz.title,
      description: quiz.description,
      date: quiz.date,
      time_limit: quiz.time_limit,
      allow_multiple_attempts: quiz.allow_multiple_attempts,
    });
    setEditingQuizId(quiz.id);
  };

  const handleDelete = async (quizId) => {
    const token = localStorage.getItem('accessToken');
    try {
      await axios.delete(`http://127.0.0.1:8000/api/quizzes/${quizId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuizzes(quizzes.filter((q) => q.id !== quizId));
      setMessage('🗑️ Quiz deleted.');
    } catch (err) {
      console.error('Failed to delete quiz:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/');
  };

  const handleDownload = async (quizId) => {
    const token = localStorage.getItem('accessToken');
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/quiz/${quizId}/download/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to download CSV');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `quiz_${quizId}_submissions.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('CSV Download Failed:', error);
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '700px', margin: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>👩‍🏫 Faculty Dashboard</h2>
        <button onClick={handleLogout} style={{ height: '35px', padding: '5px 15px' }}>Logout</button>
      </div>

      <hr /><br />

      <p><strong>{editingQuizId ? 'Edit Quiz' : 'Create a new quiz'}:</strong></p>
      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
          style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        <input
          type="datetime-local"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        <input
          type="number"
          name="time_limit"
          placeholder="Time limit (minutes)"
          value={formData.time_limit}
          onChange={handleChange}
          required
          style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        <label style={{ display: 'block', marginBottom: '10px' }}>
          <input
            type="checkbox"
            name="allow_multiple_attempts"
            checked={formData.allow_multiple_attempts}
            onChange={handleChange}
          /> Allow Multiple Attempts
        </label>
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none' }}>
          {editingQuizId ? 'Update Quiz' : 'Create Quiz'}
        </button>
      </form>

      <hr /><br />

      <h3>📋 Your Quizzes</h3>
      {quizzes.length === 0 ? (
        <p>No quizzes created yet.</p>
      ) : (
        quizzes.map((quiz) => (
          <div key={quiz.id} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '15px', borderRadius: '8px' }}>
            <h4>{quiz.title}</h4>
            <p>{quiz.description}</p>
            <p>📅 {new Date(quiz.date).toLocaleString()}</p>
            <p>⏱️ {quiz.time_limit} mins</p>
            <p>🔁 {quiz.allow_multiple_attempts ? 'Multiple Attempts Allowed' : 'Only One Attempt'}</p>
            <Link to={`/quiz/${quiz.id}/add-question`} style={{ marginRight: '15px' }}>➕ Add Questions</Link>
            <Link to={`/quiz/${quiz.id}/submissions`} style={{ marginRight: '15px' }}>📊 View Submissions</Link>
            <button onClick={() => handleEdit(quiz)} style={{ marginRight: '10px' }}>✏️ Edit</button>
            <button onClick={() => handleDelete(quiz.id)} style={{ color: 'red', marginRight: '10px' }}>🗑️ Delete</button>
            <button onClick={() => handleDownload(quiz.id)} style={{ color: 'green' }}>⬇ Download Grades</button>
          </div>
        ))
      )}
    </div>
  );
}

export default FacultyDashboard;
