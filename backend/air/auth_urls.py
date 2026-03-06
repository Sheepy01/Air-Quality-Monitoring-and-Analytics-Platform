from django.urls import path
from .views_auth import register, me, logout, LoginView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [

    path("register/", register),

    path("login/", LoginView.as_view()),

    path("refresh/", TokenRefreshView.as_view()),

    path("logout/", logout),

    path("me/", me),
]