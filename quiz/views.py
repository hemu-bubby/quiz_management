from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from django.http import JsonResponse, HttpResponse
from django.contrib.auth.hashers import make_password

from .models import User, Quiz, Question, Submission, Answer
from .serializers import (
    UserSerializer,
    QuizSerializer,
    QuestionSerializer,
    SubmissionSerializer,
    AnswerSerializer
)

import csv

# ✅ Home Test Endpoint
def home(request):
    return JsonResponse({"message": "Welcome to the Quiz API"})


# ✅ Custom permission for faculty
class IsFaculty(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_faculty


# ✅ User CRUD
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


# ✅ Quiz CRUD with faculty-only create/edit/delete
class QuizViewSet(viewsets.ModelViewSet):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsFaculty()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


# ✅ Question CRUD
class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsFaculty()]
        return [permissions.IsAuthenticated()]


# ✅ Submission ViewSet with one-time attempt check
class SubmissionViewSet(viewsets.ModelViewSet):
    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        quiz_id = request.data.get('quiz')
        try:
            quiz = Quiz.objects.get(id=quiz_id)
        except Quiz.DoesNotExist:
            return Response({'error': 'Quiz not found'}, status=404)

        if not quiz.allow_multiple_attempts:
            already_submitted = Submission.objects.filter(student=request.user, quiz=quiz).exists()
            if already_submitted:
                return Response({"error": "You have already attempted this quiz."}, status=400)

        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)


# ✅ Answer submission with auto-grading
class AnswerViewSet(viewsets.ModelViewSet):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        submission_id = self.request.data.get("submission")
        question_id = self.request.data.get("question")

        if not submission_id or not question_id:
            raise ValueError("Submission ID and Question ID are required.")

        try:
            submission = Submission.objects.get(id=submission_id)
            question = Question.objects.get(id=question_id)
        except (Submission.DoesNotExist, Question.DoesNotExist):
            raise ValueError("Invalid submission or question ID.")

        answer = serializer.save(submission=submission, question=question)

        # Auto-grade objective questions
        all_answers = Answer.objects.filter(submission=submission)
        score = 0
        for ans in all_answers:
            if ans.question.is_objective and ans.answer_text.strip().lower() == ans.question.correct_answer.strip().lower():
                score += ans.question.marks if hasattr(ans.question, 'marks') else 1  # safe fallback

        submission.score = score
        submission.save()


# ✅ Registration endpoint
@api_view(['POST'])
def register(request):
    data = request.data
    if User.objects.filter(username=data['username']).exists():
        return Response({"error": "Username already exists"}, status=400)

    user = User.objects.create(
        username=data['username'],
        email=data.get('email', ''),
        password=make_password(data['password']),
        is_student=data.get('is_student', False),
        is_faculty=data.get('is_faculty', False)
    )
    serializer = UserSerializer(user)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


# ✅ Get current logged-in user
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


# ✅ Faculty CSV Download for student grades
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_submissions_csv(request, quiz_id):
    if not request.user.is_faculty:
        return Response({'error': 'Only faculty allowed'}, status=403)

    try:
        quiz = Quiz.objects.get(id=quiz_id)
    except Quiz.DoesNotExist:
        return Response({'error': 'Quiz not found'}, status=404)

    submissions = Submission.objects.filter(quiz=quiz).select_related('student')

    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = f'attachment; filename="quiz_{quiz_id}_submissions.csv"'

    writer = csv.writer(response)
    writer.writerow(['Student Username', 'Score', 'Submitted At'])

    for sub in submissions:
        writer.writerow([sub.student.username, sub.score, sub.submitted_at])

    return response
