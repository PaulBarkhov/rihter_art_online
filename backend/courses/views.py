from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, JsonResponse
from django.conf import settings
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from . import serializers
import json
import vimeo

from . import models

def front(request):
    context = {}
    return render(request, "index.html", context)


class CourseListView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        courses = models.Course.objects.all()
        courses = serializers.CourseListSerializer(courses, many=True).data
        return Response({'courses': courses})

class CourseDetailView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, pk):
        try:
            course = models.Course.objects.get(id=pk)
            purchased_lessonPacks = request.user.profile.purchased_lessonPacks.all()
            unavailable_lessonPacks = course.lessonPacks.exclude(profiles = request.user.profile)

            return Response({
                'course': serializers.CourseDetailSerializer(course).data,
                'purchased_lessonPacks': serializers.LessonGroupSerializer(purchased_lessonPacks, many=True).data,
                'unavailable_lessonPacks': serializers.LessonGroupSerializer(unavailable_lessonPacks, many=True).data
            })
        except:
            return Response({'Error': 'Что-то пошло не так'}, status=500)
        # profile = UserProfile.objects.get(user=request.user)

        # free_lessons = course.lessons.filter(access='free')
        # free_lessons = serializers.LessonListSerializer(free_lessons, many=True)

        # purchased_lessonPacks = profile.purchased_lessonPacks.filter(course = course)
        # purchased_lessonPacks = serializers.LessonGroupSerializer(purchased_lessonPacks, many=True)

        # unavailable_lessonPacks = course.lessonPacks.exclude(profiles = profile)
        # unavailable_lessonPacks = serializers.LessonGroupSerializer(unavailable_lessonPacks, many=True)


        # return Response({ 
        #     'course_name': course.name,
        #     'course_description': course.description,
        #     'preview': course.preview.url,
        #     'free_lessons': free_lessons.data,
        #     'purchased_lessonPacks': purchased_lessonPacks.data,
        #     'unavailable_lessonPacks': unavailable_lessonPacks.data,
        # })


class GetLessonStatus(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, pk):
        profile = request.user.profile
        available = profile.available_lessons.filter(id=pk).exists()
        completed = profile.completed_lessons.filter(id=pk).exists()
        on_review = profile.lessons_on_review.filter(id=pk).exists()
        return Response({
            'available': available,
            'completed': completed,
            'on_review': on_review
        })

class LessonListView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, pk):
        course = models.Course.objects.get(id=pk)
        lessons = serializers.LessonListSerializer(course.lessons, many=True)
        return Response(lessons)

class LessonDetailView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, pk):
        profile = request.user.profile
        lesson = models.Lesson.objects.get(id=pk)

        client = vimeo.VimeoClient(
            token=settings.VIMEO_TOKEN,
            key=settings.VIMEO_KEY,
            secret=settings.VIMEO_SECRET
        )

        videos = []

        for video in lesson.videos.all():
            url = client.get(f'https://api.vimeo.com/me/videos/{video.url}', params={'fields': 'name, player_embed_url'}).json()
            videos.append(url)

        # for video in videos:
        #     print(video)

        # Make the request to the server for the "/me" endpoint.
        # video = client.get(f'https://api.vimeo.com/me/videos/{id}')

        # return JsonResponse(video.json())

        if lesson.access == 'free' or lesson in profile.available_lessons.all():
            return Response({
                'lesson': serializers.LessonSerializer(lesson).data,
                'videos': videos
            })
        else: 
            return Response(status=403)


class MarkCompleted(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, pk):
        lesson = models.Lesson.objects.get(id=pk)
        profile = request.user.profile
        profile.completed_lessons.add(lesson)
        print(profile.completed_lessons)
        return Response({'sdf': 'sdf'})



class CommentListView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, pk):
        lesson = models.Lesson.objects.get(id=pk)   
        comments = models.Comment.objects.filter(lesson=lesson, parent__isnull=True)
        return Response({'comments': serializers.CommentListSerializer(comments, many=True).data})

    def post(self, request, pk):
        # try:
            lesson = models.Lesson.objects.get(id=pk)
            user = self.request.user
            data = self.request.data

            text = data["text"]
            voice = data["voice"]
            parentID = data["parentID"]

            if not parentID:
                models.Comment.objects.create(lesson=lesson, user=user, text=text, voice=voice)    
            else:
                parentMessage = models.Comment.objects.get(pk=parentID)
                text = parentMessage.user.first_name + ', ' + text
                models.Comment.objects.create(lesson=lesson, user=user, text=text, voice=voice, parent=parentMessage)  

            return Response(data=None, status=200)

class CommentDetailView(APIView):
    permission_classes = [IsAuthenticated]
    def delete(self, request, pk):
        # try:
            comment = models.Comment.objects.get(id=pk)
            comment.delete()
            return Response(None, status=200)
        # except:
        #     return Response(None, status=500)

class ExcersizeDetailView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, lesson_pk, excersize_pk):
        lesson = models.Lesson.objects.get(id=lesson_pk)
        try:
            excersize = models.Excersize.objects.get(lesson=lesson)
        except models.Excersize.DoesNotExist:
            excersize = models.Excersize.objects.create(lesson=lesson)
        # return Response(serializers.ExcersizeDetailSerializer(excersize).data)
        if self.request.user.is_staff:
            if models.Review.objects.filter(excersize=excersize).exists():
                reviews = models.Review.objects.filter(excersize=excersize)
                reviews = serializers.ReviewSerializer(reviews, many=True).data
            else: reviews = []
            return Response({
                'excersize': serializers.ExcersizeDetailSerializer(excersize).data,
                'reviews': reviews
            })
        else:
            if models.Review.objects.filter(excersize=excersize, profile=self.request.user.profile).exists():
                reviews = models.Review.objects.filter(excersize=excersize, profile=self.request.user.profile)
                reviews = serializers.ReviewSerializer(reviews, many=True).data
            else: reviews = []
            return Response({
                'excersize': serializers.ExcersizeDetailSerializer(excersize).data,
                'reviews': reviews
            })


# class ReviewView(APIView):
#     permission_classes = [IsAuthenticated]
#     def get(self, request, lesson_pk, excersize_pk):
#         excersize = models.Excersize.objects.get(id=excersize_pk)
#         if self.request.user.is_staff:
#             if models.Review.objects.filter(excersize=excersize).exists():
#                 reviews = models.Review.objects.filter(excersize=excersize)
#                 reviews = serializers.ReviewSerializer(reviews, many=True).data
#             else: reviews = []
#             return Response({
#                 'excersize': serializers.ExcersizeDetailSerializer(excersize).data,
#                 'reviews': reviews
#             })
#         else:
#             if models.Review.objects.filter(excersize=excersize, profile=self.request.user.profile).exists():
#                 reviews = models.Review.objects.filter(excersize=excersize, profile=self.request.user.profile)
#                 reviews = serializers.ReviewSerializer(reviews, many=True).data
#             else: reviews = []
#             return Response({
#                 'excersize': serializers.ExcersizeDetailSerializer(excersize).data,
#                 'reviews': reviews
#             })


class ReviewMessageListView(APIView):
    permission_classes = [IsAuthenticated]        
    def get(self, request, lesson_pk, excersize_pk):
        pass
        
    def post(self, request, lesson_pk, excersize_pk):
        excersize = models.Excersize.objects.get(id=excersize_pk)

        data = self.request.data
        text = data["text"]
        voice = data["voice"]
        parentID = data["parentID"]

        # if self.request.user.is_staff:
        #     pass

        if parentID:
            parentMessage = models.ReviewMessage.objects.get(pk=parentID)
            text = parentMessage.user.first_name + ', ' + text
            models.ReviewMessage.objects.create(review=parentMessage.review, user=self.request.user, text=text, voice=voice, parent=parentMessage)  
        elif not models.Review.objects.filter(excersize=excersize, profile=self.request.user.profile).exists():
            models.Review.objects.create(excersize=excersize, profile=self.request.user.profile, status='onReview')
            review = models.Review.objects.get(excersize=excersize, profile=self.request.user.profile)
            models.ReviewMessage.objects.create(review=review, user=self.request.user, text=text, voice=voice)  

        return Response(None, status=200)

class ReviewMessageDetailView(APIView):
    permission_classes = [IsAuthenticated]        
    def delete(self, request, lesson_pk, excersize_pk, message_pk):
        
        message = models.ReviewMessage.objects.get(id=message_pk)
        message.delete()

        if len(message.review.review_messages.values()) == 0:
            message.review.delete()

        return Response(None, status=200)

@csrf_exempt
def comments(request, pk):
    lesson = models.Lesson.objects.get(pk=pk)
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode("utf-8"))
            comment = models.Comment(
                text=data["text"], lesson=lesson, user=request.user)
            if comment is not None:
                comment.save()
            return HttpResponse(status=200)
        except Exception as e:
            return HttpResponse(status=e.status)

    comments = list(lesson.comments.all().values())
    return JsonResponse(comments, safe=False)


@csrf_exempt
def upload_photo(request, pk):
    lesson = models.Lesson.objects.get(pk=pk)
    data = request.FILES['photo']
    # photo = models.Photo(lesson=lesson, name='qgertgerwf', url=data)
    # photo.save()
    return HttpResponse(status=200)


@csrf_exempt
def upload_profile_image(request):
    user = request.user
    profile = user.profile
    profile.profile_image = request.FILES['photo']
    profile.save()
    return HttpResponse(status=200)

@csrf_exempt
def buy_lessonPack(request):
    user = request.user
    profile = user.profile
    lessonPackID = json.loads(request.body.decode("utf-8"))['lessonPack']
    lessonPack = models.LessonPack.objects.get(pk=lessonPackID)
    profile.purchased_lessonPacks.add(lessonPack)
    print(lessonPack)

    return HttpResponse(status=200)

