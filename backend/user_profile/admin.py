from django.contrib import admin
from .models import UserProfile
from django.utils.safestring import mark_safe

# Register your models here.
@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "get_profile_image")
    list_display_links = ("id", "user", "get_profile_image", )
    readonly_fields = ("get_profile_image", )

    def get_profile_image(self, obj):
        if obj.profile_image: 
            return mark_safe(f'<img src={obj.profile_image.url} width="300" height="300" style="object-fit: cover"/>')

    get_profile_image.short_description = "Изображение"