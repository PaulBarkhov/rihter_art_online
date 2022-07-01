from django.contrib import admin
from . import models
from user_profile.models import UserProfile
from django.utils.safestring import mark_safe
# Register your models here.
admin.site.site_header = "Rihter Art Online - Панель администрирования"

class LessonInline(admin.StackedInline):
    model = models.Lesson
    extra = 1

class PhotoInline(admin.StackedInline):
    model = models.Photo
    extra = 1

    readonly_fields = ("get_image", )

    def get_image(self, obj):
        if obj.url: 
            return mark_safe(f'<img src={obj.url.url} width="300" height="300" />')

    get_image.short_description = "Изображение"

class VideoInline(admin.StackedInline):
    model = models.Video
    extra = 1

@admin.register(models.Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "description", "draft")
    list_display_links = ("name", )
    inlines = [LessonInline]
    save_on_top = True
    list_editable = ("draft", )

@admin.register(models.Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "course", "get_preview")
    list_display_links = ("name", )
    readonly_fields = ("get_preview", )
    inlines = [PhotoInline, VideoInline]
    list_filter = ("course", )
    search_fields = ("name", )

    def get_preview(self, obj):
        if obj.preview: 
            return mark_safe(f'<img src={obj.preview.url} width="300" height="300" />')

    get_preview.short_description = "Изображение"

@admin.register(models.Photo)
class PhotoAdmin(admin.ModelAdmin):
    list_display = ("get_image", )
    list_display_links = ("get_image", )
    readonly_fields = ("get_image", )

    def get_image(self, obj):
        if obj.url: 
            return mark_safe(f'<img src={obj.url.url} width="300" height="300" />')

    get_image.short_description = "Изображение"

# admin.site.register(UserProfile)
# admin.site.register(models.Course, CourseDisplay)
admin.site.register(models.LessonPack)
# admin.site.register(models.Lesson)
admin.site.register(models.Comment)
# admin.site.register(models.Photo)
admin.site.register(models.Order)
admin.site.register(models.Excersize)
admin.site.register(models.Review)
admin.site.register(models.ReviewMessage)
