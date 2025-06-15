import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function QuizAttempt() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null); // in seconds
  const [message, setMessage] = useState('');
  const [timerId, setTimerId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    const fetchQuizData = async () => {
      try {
        const [quizRes, questionRes] = await Promise.all([
          axios.get(`http://127.0.0.1:8000/api/quizzes/${quizId}/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://127.0.0.1:8000/api/questions/', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const totalSeconds = quizRes.data.time_limit * 60;
        setQuiz(quizRes.data);
        setQuestions(questionRes.data.filter(q => q.quiz === parseInt(quizId)));
        setTimeLeft(totalSeconds);

        const interval = setInterval(() => {
          setTimeLeft(prev => {
            if (prev <= 1) {
              clearInterval(interval);
              handleSubmit(); // auto-submit on timeout
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        setTimerId(interval);
      } catch (error) {
        console.error('Failed to load quiz:', error);
      }
    };

    fetchQuizData();
    return () => clearInterval(timerId);
  }, [quizId]);

  const formatTime = (secs) => {
    const min = Math.floor(secs / 60);
    const sec = secs % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const handleChange = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    clearInterval(timerId);
    const token = localStorage.getItem('accessToken');

    if (questions.length === 0) {
      setMessage('❌ No questions found for this quiz.');
      return;
    }

    try {
      // 1. Create submission
      const submissionRes = await axios.post('http://127.0.0.1:8000/api/submissions/', {
        quiz: parseInt(quizId),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const submissionId = submissionRes.data.id;

      // 2. Submit each answer
      const answerRequests = questions.map(q => {
        return axios.post('http://127.0.0.1:8000/api/answers/', {
          submission: submissionId,
          question: q.id,
          answer_text: answers[q.id] || '',
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      });

      await Promise.all(answerRequests);
      setMessage('✅ Quiz submitted successfully!');
      setTimeout(() => navigate('/student-dashboard'), 2000);
    } catch (error) {
      console.error('Submit error:', error.response?.data || error.message);
      setMessage('❌ Failed to submit quiz.');
    }
  };

  return (
    <div style={{ padding: '30px' }}>
      <h2>📝 Attempt Quiz</h2>
      {quiz && <p><strong>Time Left:</strong> ⏳ {formatTime(timeLeft)}</p>}
      {message && <p style={{ color: message.includes('✅') ? 'green' : 'red' }}>{message}</p>}

      <form onSubmit={handleSubmit}>
        {questions.map((q, index) => (
          <div key={q.id} style={{ marginBottom: '20px' }}>
            <p><strong>Q{index + 1}: {q.question_text}</strong></p>
            {q.options && q.options.length > 0 ? (
              q.options.map((opt, i) => (
                <div key={i}>
                  <label>
                    <input
                      type="radio"
                      name={`question-${q.id}`}
                      value={opt}
                      checked={answers[q.id] === opt}
                      onChange={(e) => handleChange(q.id, e.target.value)}
                    />
                    {opt}
                  </label>
                </div>
              ))
            ) : (
              <input
                type="text"
                value={answers[q.id] || ''}
                onChange={(e) => handleChange(q.id, e.target.value)}
                required
                style={{ width: '100%', padding: '8px' }}
              />
            )}
          </div>
        ))}

        {questions.length > 0 && (
          <button type="submit" style={{ padding: '10px', width: '100%' }}>
            Submit Answers
          </button>
        )}
      </form>
    </div>
  );
}

export default QuizAttempt;
