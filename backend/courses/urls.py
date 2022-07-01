from django.urls import path, include
from . import views
from django.contrib.auth import views as auth_views


urlpatterns = [
    path("all_courses", views.CourseListView.as_view()),
    path("course/<int:pk>", views.CourseDetailView.as_view()),
    path('lesson/<int:pk>', views.LessonDetailView.as_view()),
    path('lesson/<int:pk>/complete', views.MarkCompleted.as_view()),
    path('lesson/<int:pk>/get_status', views.GetLessonStatus.as_view()),
    path('lesson/<int:pk>/comments', views.CommentListView.as_view()),
    path('comment/<int:pk>', views.CommentDetailView.as_view()),
    path('lesson/<int:lesson_pk>/excersizes/<int:excersize_pk>', views.ExcersizeDetailView.as_view()),
    path('lesson/<int:lesson_pk>/excersizes/<int:excersize_pk>/messages', views.ReviewMessageListView.as_view()),
    path('lesson/<int:lesson_pk>/excersizes/<int:excersize_pk>/messages/<int:message_pk>', views.ReviewMessageDetailView.as_view()),


    # path('courses/', views.CourseListView.as_view()),
    # path('courses/<int:pk>', views.CourseDetailView.as_view()),
    # path('register', views.RegisterView.as_view()),
    # path('get_csrf', views.GetCSRFToken.as_view()),
    # path('login', views.LoginView.as_view()),
    # path('logout', views.LogoutView.as_view()),
    # path('check_authentication', views.CheckAuthenticationView.as_view()),

    # path("get_all_courses", views.get_all_courses),
    # path("account", views.account_view),
    # path("video/<int:id>", views.video),
    # path("auth", views.auth),
    # path("lesson/<int:pk>/comments", views.comments),
    # path("profile/<int:pk>", views.profile),
    # path("verification", views.verification_view),
    # path("verify_code", views.verify_code),
    # path("new_password", views.new_password),
    # path("lesson/<int:pk>/upload_photo", views.upload_photo),
    # path("upload_profile_image", views.upload_profile_image),
    # path("buy_lessonPack", views.buy_lessonPack)
]
