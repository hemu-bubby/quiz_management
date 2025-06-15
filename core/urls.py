from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from quiz.views import home

urlpatterns = [
    # Root home test endpoint
    path('', home, name='home'),

    # Django Admin
    path('admin/', admin.site.urls),

    # App-specific API routes
    path('api/', include('quiz.urls')),

    # JWT Authentication Endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),         # Login
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),         # Refresh token
]
