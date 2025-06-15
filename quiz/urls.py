from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    UserViewSet,
    QuizViewSet,
    QuestionViewSet,
    SubmissionViewSet,
    AnswerViewSet,
    register,
    get_current_user  # ✅ for /api/me/
)

# Register all viewsets with DRF router
router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'quizzes', QuizViewSet)
router.register(r'questions', QuestionViewSet)
router.register(r'submissions', SubmissionViewSet)
router.register(r'answers', AnswerViewSet)

# Final URL patterns
urlpatterns = [
    path('register/', register),            # User registration
    path('me/', get_current_user),          # Get logged-in user details
    path('', include(router.urls)),         # All ViewSet routes
]
from .views import download_submissions_csv

urlpatterns += [
    path('quiz/<int:quiz_id>/download/', download_submissions_csv),  # 👈 Add this
]
