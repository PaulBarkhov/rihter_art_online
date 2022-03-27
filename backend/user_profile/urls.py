from django.urls import path, include
from .views import GetUserProfileView


urlpatterns = [
    path('user', GetUserProfileView.as_view())
]