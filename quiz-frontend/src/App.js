import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import FacultyDashboard from './components/FacultyDashboard';
import QuizAttempt from './components/QuizAttempt';
import AddQuestion from './components/AddQuestion';
import StudentResult from './components/StudentResult';
import ViewSubmissions from './components/ViewSubmissions';
import StudentAttempts from './components/StudentAttempts';
import StudentAnswerReview from './components/StudentAnswerReview';
import QuizSubmissions from './components/QuizSubmissions';
import SubmissionAnswers from './components/SubmissionAnswers';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
        <Route path="/quiz/:quizId" element={<QuizAttempt />} />
        <Route path="/quiz/:quizId/add-question" element={<AddQuestion />} />
        <Route path="/result/:submissionId" element={<StudentResult />} />
        <Route path="/quiz/:quizId/submissions" element={<ViewSubmissions />} />
        <Route path="/student-attempts" element={<StudentAttempts />} />
        <Route path="/submission/:submissionId/answers" element={<StudentAnswerReview />} />
        <Route path="/quiz/:quizId/submissions" element={<QuizSubmissions />} />
        <Route path="/submission/:submissionId/answers" element={<SubmissionAnswers />} />
      </Routes>
    </Router>
  );
}

export default App;
