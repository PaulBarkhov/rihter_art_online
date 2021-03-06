from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path("", TemplateView.as_view(template_name='index.html')),
    path("api/", include('courses.urls')),
    path('authentication/', include('authentication.urls')),
    path('profile/', include('user_profile.urls')),
    path('auth/', include('djoser.urls')),
    path('ckeditor/', include('ckeditor_uploader.urls')),
    # path('auth/', include('djoser.urls.jwt'))
]

urlpatterns += [re_path(r'^.*', TemplateView.as_view(template_name='index.html'))]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
