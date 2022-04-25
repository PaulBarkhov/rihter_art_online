import random
from django.core.mail import send_mail
from django.contrib.auth.models import User

from rest_framework.permissions import AllowAny 
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from .models import Verification
from user_profile.models import UserProfile


# < JWT >
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        # ...

        return token
# </ JWT >


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        data = self.request.data
        if data['code'] == Verification.objects.get(email=data['email']).code:

            username = data["email"]
            first_name = data["firstName"]
            last_name = data["lastName"]
            email = data["email"]
            password = data["password"]

            try:
                if User.objects.filter(username=username).exists():
                    return Response({'error': 'Email занят'})
                else: 
                    User.objects.create_user(username=username, email=email, password=password, first_name=first_name, last_name=last_name)
                    UserProfile.objects.create(user=User.objects.get(username=username))
                    print("Success")
                    return Response({'success': 'Успех'}, 200)
            except: 
                return Response({'Error': 'Что-то пошло не так при попытке загеристрироваться'}, 500)

        else: return Response({'Error': 'Неверный код'}, 400)


class Send_verification_code(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        data = self.request.data

        if User.objects.filter(email = data['email']).exists():
            return Response({'error': 'Email занят'}, 409)

        code = random.randint(1111, 9999)
        Verification.objects.update_or_create(email=data['email'], code=code)
        # request.session['verification'] = {
        #     "email": data["email"],
        #     "code": code
        # }
        send_mail(
            'Код подтверждения',
            f'Ваш код подтверждения: {code} \n\nЕсли вы не запрашивали код, игнорируйте это письмо и никому не говорите этот код. \n\n P.S. Привет всем пусечкам лапотусечкам',
            'pavelbarhov@gmail.com',
            [data["email"]],
            fail_silently=False,
        )
        return Response({'success': 'Успех'})

class Send_reset_code(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        data = self.request.data
        if User.objects.filter(email = data['email']).exists():
            code = random.randint(1111, 9999)
            Verification.objects.update_or_create(email=data['email'], code=code)
            send_mail(
                'Код сброса пароля',
                f'Ваш код подтверждения: {code} \n\nЕсли вы не запрашивали код, игнорируйте это письмо и никому не говорите этот код. \n\n P.S. Привет всем пусечкам лапотусечкам',
                'pavelbarhov@gmail.com',
                [data["email"]],
                fail_silently=False,
            )
            return Response({'success': 'Успех'}, 200)
        else: return Response({'Пользователя с таким Email не существует'}, 404)



# def send_verification_code(request):
#     if request.method == 'POST':
#         print('ok')
#         return HttpResponse(status=200)
    # data = json.loads(request.body.decode("utf-8"))
    # if User.objects.filter(email = data['email']).exists():
    #     return HttpResponse('qweqweqwe', status=409)
    # return HttpResponse(status=409)
    # code = random.randint(1111, 9999)
    # request.session['reset_password'] = {
    #     "email": data["email"],
    #     "code": code
    # }
    # send_mail(
    #     'Код подтверждения',
    #     f'Ваш код подтверждения: {code} \n\nЕсли вы не запрашивали код, игнорируйте это письмо и никому не говорите этот код. \n\n P.S. Привет всем пусечкам лапотусечкам',
    #     'pavelbarhov@gmail.com',
    #     [data["email"]],
    #     fail_silently=False,
    # )
    # return HttpResponse(status=400)


# def verify_code(request):
#     data = json.loads(request.body.decode("utf-8"))
#     if request.session['reset_password']['code'] == int(data["code"]):
#         print('good')
#         return HttpResponse(status=200)
#     else:
#         return HttpResponse('Неверный код', status=403)


# def new_password(request):
#     data = json.loads(request.body.decode("utf-8"))
#     user = User.objects.get(email=request.session['reset_password']['email'])
#     if user is not None:
#         user.set_password(data["password"])
#         user.save()
#         return HttpResponse(status=200)
#     else:
#         return HttpResponse('Что-то пошло не так', status=403)