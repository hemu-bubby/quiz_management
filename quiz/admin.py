from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Quiz, Question, Submission, Answer

class CustomUserAdmin(BaseUserAdmin):
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Role Flags', {'fields': ('is_student', 'is_faculty')}),
    )
    list_display = ('username', 'email', 'is_student', 'is_faculty', 'is_staff')

admin.site.register(User, CustomUserAdmin)
admin.site.register(Quiz)
admin.site.register(Question)
admin.site.register(Submission)
admin.site.register(Answer)
