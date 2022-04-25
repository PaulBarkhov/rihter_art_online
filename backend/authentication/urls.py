from django.urls import path, include
from . import views

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [
    path('token', views.MyTokenObtainPairView.as_view()),
    path('token/refresh', TokenRefreshView.as_view()),
    path('register', views.RegisterView.as_view()),
    path('request_verification_code', views.Send_verification_code.as_view()),
    # path('get_csrf', views.GetCSRFToken.as_view()),
    # path('login', views.LoginView.as_view()),
    # path('logout', views.LogoutView.as_view()),
    # path('check_authentication', views.CheckAuthenticationView.as_view()),
]