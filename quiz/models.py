from django.db import models
from django.contrib.auth.models import AbstractUser


# ✅ Custom User with role flags
class User(AbstractUser):
    is_faculty = models.BooleanField(default=False)
    is_student = models.BooleanField(default=False)


# ✅ Quiz model with time, creator, and multiple attempt control
class Quiz(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    date = models.DateTimeField()
    time_limit = models.IntegerField(help_text="Time in minutes")
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    allow_multiple_attempts = models.BooleanField(default=False)

    def __str__(self):
        return self.title


# ✅ Question model supporting MCQ and marks
class Question(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    question_text = models.TextField()
    is_objective = models.BooleanField(default=True)
    correct_answer = models.CharField(max_length=255, blank=True, null=True)
    options = models.JSONField(blank=True, null=True)  # For MCQ options (list of strings)
    marks = models.IntegerField(default=1)

    def __str__(self):
        return f"{self.question_text} ({'MCQ' if self.is_objective else 'Descriptive'})"


# ✅ Submission model: student + quiz + timestamp + score
class Submission(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    submitted_at = models.DateTimeField(auto_now_add=True)
    score = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.student.username} - {self.quiz.title}"


# ✅ Answer model: links answer to submission and question
class Answer(models.Model):
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    answer_text = models.TextField()

    def __str__(self):
        return f"Answer by {self.submission.student.username} to Q{self.question.id}"
