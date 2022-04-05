from os import access
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie, csrf_protect
from django.contrib.auth.models import User
# from backend import authentication
from user_profile.models import UserProfile
from django.http import HttpResponse, JsonResponse
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import authentication, generics
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from . import serializers
from django.db.models import Min, Count
import json
import random
import vimeo


from . import models

def front(request):
    context = {}
    return render(request, "index.html", context)


class CourseListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = serializers.CourseListSerializer
    queryset = models.Course.objects.all()

# class CourseDetailView(generics.RetrieveAPIView):
#     serializer_class = serializers.CourseDetailSerializer
#     queryset = models.Course.objects.all()

class CourseDetailView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, pk):
        course = models.Course.objects.get(id=pk)
        profile = UserProfile.objects.get(user=request.user)

        free_lessons = course.lessons.filter(access='free')
        free_lessons = serializers.LessonSerializer(free_lessons, many=True)

        purchased_lessonPacks = profile.purchased_lessonPacks.filter(course = course)
        purchased_lessonPacks = serializers.LessonGroupSerializer(purchased_lessonPacks, many=True)

        unavailable_lessonPacks = course.lessonPacks.exclude(profiles = profile)
        unavailable_lessonPacks = serializers.LessonGroupSerializer(unavailable_lessonPacks, many=True)

        return Response({ 
            'free_lessons': free_lessons.data,
            'purchased_lessonPacks': purchased_lessonPacks.data,
            'unavailable_lessonPacks': unavailable_lessonPacks.data
        })



def get_all_courses(request):
    profile = request.user.profile
    courses = []
    for course in models.Course.objects.all():
        number_of_free_lessons = len(course.lessons.filter(access='free').values()) + 1
        purchased_lessonPacks = profile.purchased_lessonPacks.filter(course = course)
        number_of_purchased_lessons = 0
        for purchased_lessonPack in purchased_lessonPacks:
            number_of_purchased_lessons = len(purchased_lessonPack.lessons.all().values()) + 1
        number_of_available_lessons = number_of_free_lessons + number_of_purchased_lessons
        total_number_of_lessons = len(course.lessons.all().values()) + 1
        prices = []
        lessonPacks = course.lessonPacks.all().values("price")
        for lessonPack in lessonPacks:
            prices.append(lessonPack['price'])
        course = course.__dict__
        del course['_state']
        courses.append({
            **course,
            'price': prices and min(prices) or 0,
            'number_of_available_lessons': number_of_available_lessons,
            'total_number_of_lessons': total_number_of_lessons
        })

    return JsonResponse(list(courses), safe=False)

def get_lessons(request, pk):
    course = models.Course.objects.get(id=pk)
    user = request.user
    profile = user.profile

    purchased_lessons = []
    purchased_lessonPacks = profile.purchased_lessonPacks.filter(course=course)
    for lessonPack in purchased_lessonPacks:
        purchased_lessons.extend(lessonPack.lessons.all().values())
    unavailable_lessons = []
    unavailable_lessonPacks = []
    lessonPacks = course.lessonPacks.all()
    for lessonPack in lessonPacks:
        if lessonPack not in purchased_lessonPacks:
            unavailable_lessonPack = {
                'id': lessonPack.id,
                'course': lessonPack.course.id,
                'name': lessonPack.name,
                'price': lessonPack.price,
                'videos': []
            }
            unavailable_lessonPack['videos'].extend(lessonPack.lessons.all().values('id', 'name'))
            unavailable_lessonPacks.append(unavailable_lessonPack)

    lessons = {
        'free_lessons': list(course.lessons.filter(access='free').values()),
        'purchased_lessons': purchased_lessons,
        'unavailable_lessonPacks': unavailable_lessonPacks
    }


    return JsonResponse(lessons)


def video(request, id):

    client = vimeo.VimeoClient(
        token=settings.VIMEO_TOKEN,
        key=settings.VIMEO_KEY,
        secret=settings.VIMEO_SECRET
    )

    # Make the request to the server for the "/me" endpoint.
    video = client.get(f'https://api.vimeo.com/me/videos/{id}')

    return JsonResponse(video.json())

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
def verification_view(request):
    data = json.loads(request.body.decode("utf-8"))
    if User.objects.filter(email = data['email']).exists():
        return HttpResponse('qweqweqwe', status=409)
    return HttpResponse(status=409)
    code = random.randint(1111, 9999)
    request.session['reset_password'] = {
        "email": data["email"],
        "code": code
    }
    send_mail(
        'Код подтверждения',
        f'Ваш код подтверждения: {code} \n\nЕсли вы не запрашивали код, игнорируйте это письмо и никому не говорите этот код. \n\n P.S. Привет всем пусечкам лапотусечкам',
        'pavelbarhov@gmail.com',
        [data["email"]],
        fail_silently=False,
    )
    return HttpResponse(status=400)


@csrf_exempt
def verify_code(request):
    data = json.loads(request.body.decode("utf-8"))
    if request.session['reset_password']['code'] == int(data["code"]):
        print('good')
        return HttpResponse(status=200)
    else:
        return HttpResponse('Неверный код', status=403)


@csrf_exempt
def new_password(request):
    data = json.loads(request.body.decode("utf-8"))
    user = User.objects.get(email=request.session['reset_password']['email'])
    if user is not None:
        user.set_password(data["password"])
        user.save()
        return HttpResponse(status=200)
    else:
        return HttpResponse('Что-то пошло не так', status=403)


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

