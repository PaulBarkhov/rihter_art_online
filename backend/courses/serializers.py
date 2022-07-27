from rest_framework.serializers import Serializer, ModelSerializer, SlugRelatedField, SerializerMethodField, FloatField, DateTimeField, CharField
from django.contrib.auth.models import User
from . import models
from user_profile.serializers import UserProfileSerializer


class UserSerializer(ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'email', 'profile')

class PhotoSerializer(ModelSerializer):
    class Meta:
        model = models.Photo
        fields = ('__all__')

class VideoSerializer(ModelSerializer):
    class Meta:
        model = models.Video
        fields = ('__all__')

class RecursiveSerializer(Serializer):
    def to_representation(self, value):
        serializer = self.parent.parent.__class__(value, context=self.context)
        return serializer.data

class CommentImageSerializer(ModelSerializer):
    class Meta: 
        model = models.CommentImage
        fields = ('__all__')

class CommentListSerializer(ModelSerializer):
    user = UserSerializer(read_only=True)
    date = DateTimeField(format="%d.%m.%Y %H:%M:%S")
    children = RecursiveSerializer(many=True)
    comment_images = CommentImageSerializer(read_only=True, many=True)
    class Meta:
        model = models.Comment
        fields = ('__all__')

class LessonListSerializer(ModelSerializer):
    class Meta:
        model = models.Lesson
        fields = ['id', 'name', 'description', 'preview', 'access']

class LessonSerializer(ModelSerializer):
    photos = PhotoSerializer(read_only=True, many=True)
    comments = CommentListSerializer(read_only=True, many=True)
    class Meta:
        model = models.Lesson
        fields = ('__all__')

class LessonGroupSerializer(ModelSerializer):
    course_name = CharField(source='get_course_name')
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
    currency = CharField()
    class Meta:
        model = models.Course
        fields = ('__all__') 

class CourseDetailSerializer(ModelSerializer):
    lessons = LessonListSerializer(read_only=True, many=True)
    currency = CharField()
    class Meta:
        model = models.Course
        fields = ('__all__')

class VoiceMessageSerializer(ModelSerializer):
    class Meta:
        model = models.VoiceMessage
        fields = ('__all__') 

class ReviewMessageImageSerializer(ModelSerializer):
    class Meta:
        model = models.ReviewMessageImage
        fields = ('__all__')

class ReviewMessageSerializer(ModelSerializer):
    user = UserSerializer(read_only=True)
    date = DateTimeField(format="%d.%m.%Y %H:%M:%S")
    children = RecursiveSerializer(many=True)
    review_message_images = ReviewMessageImageSerializer(read_only=True, many=True)
    class Meta:
        model = models.ReviewMessage
        fields = ('__all__')

class ReviewSerializer(ModelSerializer):
    review_messages = ReviewMessageSerializer(read_only=True, many=True)
    class Meta:
        model = models.Review
        fields = ('__all__') 

class ExcersizeDetailSerializer(ModelSerializer):
    class Meta:
        model = models.Excersize
        fields = ('__all__') 

