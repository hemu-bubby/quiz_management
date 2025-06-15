import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function AddQuestion() {
  const { quizId } = useParams();
  const [questionText, setQuestionText] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [marks, setMarks] = useState(1); // New field for manual grading
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');

    try {
      await axios.post('http://127.0.0.1:8000/api/questions/', {
        quiz: quizId,
        question_text: questionText,
        is_objective: true,
        correct_answer: correctAnswer,
        options: options.filter(opt => opt.trim() !== ''),
        marks: parseInt(marks)
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMessage('✅ Question added!');
      setQuestionText('');
      setCorrectAnswer('');
      setOptions(['', '', '', '']);
      setMarks(1);
    } catch (error) {
      console.error(error);
      setMessage('❌ Failed to add question.');
    }
  };

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  return (
    <div style={{ padding: '30px', maxWidth: '500px', margin: 'auto' }}>
      <h2>Add Question to Quiz #{quizId}</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <textarea
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="Enter your question"
          required
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />

        {options.map((opt, index) => (
          <input
            key={index}
            type="text"
            value={opt}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            placeholder={`Option ${index + 1}`}
            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
          />
        ))}

        <input
          type="text"
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(e.target.value)}
          placeholder="Correct Answer (must match one option)"
          required
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />

        <input
          type="number"
          value={marks}
          onChange={(e) => setMarks(e.target.value)}
          placeholder="Marks for this question"
          required
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />

        <button type="submit" style={{ width: '100%', padding: '10px' }}>Add Question</button>
      </form>
    </div>
  );
}

export default AddQuestion;
