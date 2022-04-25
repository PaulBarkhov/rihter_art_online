from rest_framework.serializers import ModelSerializer, SlugRelatedField, SerializerMethodField, FloatField
from django.contrib.auth.models import User
from . import models


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('__all__')

class PhotoSerializer(ModelSerializer):
    class Meta:
        model = models.Photo
        fields = ('__all__')

class VideoSerializer(ModelSerializer):
    class Meta:
        model = models.Video
        fields = ('__all__')

class LessonListSerializer(ModelSerializer):
    class Meta:
        model = models.Lesson
        fields = ['id', 'name', 'description', 'preview', 'access']

class LessonSerializer(ModelSerializer):
    photos = PhotoSerializer(read_only=True, many=True)
    class Meta:
        model = models.Lesson
        fields = ('__all__')

class LessonGroupSerializer(ModelSerializer):
    class Meta:
        model = models.LessonPack
        fields = ('__all__')

class CourseListSerializer(ModelSerializer):
    # user = UserSerializer(required=False, read_only=True)
    # profile = ProfileSerializer(read_only=True)
    # lessons = LessonSerializer(read_only=True, many=True)
    # lessons_groups = LessonGroupSerializer(read_only=True, many=True)
    # lessonPacks = LessonGroupSerializer(read_only=True, many=True)
    min_price = FloatField(source='get_min_price')
    class Meta:
        model = models.Course
        fields = ('__all__') 

class CourseDetailSerializer(ModelSerializer):
    lessons = LessonListSerializer(read_only=True, many=True)
    # lessonPacks = LessonGroupSerializer(read_only=True, many=True)
    class Meta:
        model = models.Course
        fields = ('__all__')
