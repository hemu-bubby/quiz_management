from rest_framework import serializers
from .models import User, Quiz, Question, Submission, Answer


# ✅ User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_faculty', 'is_student']


# ✅ Quiz Serializer
class QuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = [
            'id', 'title', 'description', 'date',
            'time_limit', 'created_by', 'allow_multiple_attempts'
        ]
        read_only_fields = ['created_by']


# ✅ Question Serializer (supports MCQs + marks)
class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = [
            'id', 'quiz', 'question_text', 'is_objective',
            'correct_answer', 'options', 'marks'
        ]


# ✅ Submission Serializer (with student username + quiz title)
class SubmissionSerializer(serializers.ModelSerializer):
    quiz_title = serializers.CharField(source='quiz.title', read_only=True)
    student_username = serializers.CharField(source='student.username', read_only=True)

    class Meta:
        model = Submission
        fields = ['id', 'quiz', 'quiz_title', 'student', 'student_username', 'score', 'submitted_at']
        read_only_fields = ['score', 'submitted_at', 'student']  # 👈 Add 'student' here


# ✅ Answer Serializer (includes question & correct answer)
class AnswerSerializer(serializers.ModelSerializer):
    question_text = serializers.CharField(source='question.question_text', read_only=True)
    correct_answer = serializers.CharField(source='question.correct_answer', read_only=True)

    class Meta:
        model = Answer
        fields = [
            'id', 'submission', 'question', 'question_text',
            'answer_text', 'correct_answer'
        ]
