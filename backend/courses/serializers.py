from rest_framework import serializers
from django.contrib.auth.models import User
from . import models


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('__all__')

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Lesson
        fields = ('__all__')

class LessonGroupSerializer(serializers.ModelSerializer): 
    lessons = LessonSerializer(many=True, read_only=True)
    class Meta:
        model = models.LessonPack
        fields = ('__all__')


class CourseListSerializer(serializers.ModelSerializer):
    # user = UserSerializer(required=False, read_only=True)
    # profile = ProfileSerializer(read_only=True)
    # lessons = LessonSerializer(read_only=True, many=True)
    # lessons = serializers.SlugRelatedField(slug_field="name", read_only=True, many=True)
    class Meta:
        model = models.Course
        fields = ('__all__')

class CourseDetailSerializer(serializers.ModelSerializer):
    lessonPacks = LessonGroupSerializer(read_only=True, many=True)
    class Meta:
        model = models.Course
        fields = ['id', 'name', 'lessonPacks']
