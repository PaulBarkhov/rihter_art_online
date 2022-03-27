from django.urls import path, include
from . import views
from django.contrib.auth import views as auth_views


urlpatterns = [
    path('register', views.RegisterView.as_view()),
    path('get_csrf', views.GetCSRFToken.as_view()),
    path('login', views.LoginView.as_view()),
    path('logout', views.LogoutView.as_view()),
    path('check_authentication', views.CheckAuthenticationView.as_view()),
]