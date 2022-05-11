from django.urls import path, include
from .views import UpdateProfileImage, UpdateProfileView, UserProfileView


urlpatterns = [
    path('me', UserProfileView.as_view()),
    path('update', UpdateProfileView.as_view()),
    path('update_profile_image', UpdateProfileImage.as_view()),
]