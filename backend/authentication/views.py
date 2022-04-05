from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie, csrf_protect
from django.utils.decorators import method_decorator
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout

from rest_framework.permissions import AllowAny 
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token

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

        username = data["email"]
        first_name = data["firstName"]
        last_name = data["lastName"]
        email = data["email"]
        password = data["password"]

        try:
            if User.objects.filter(username=username).exists():
                return Response({'error': 'Пользователь с таким Email уже существует'})
            else: 
                user = User.objects.create_user(username=username, email=email, password=password, first_name=first_name, last_name=last_name)
                profile = UserProfile.objects.create(user=User.objects.get(username=username))
                print("Success")
                return Response({'success': 'Успех'})
        except: 
            return Response({'Error': 'Что-то пошло не так при попытке загеристрироваться'})

# @method_decorator(ensure_csrf_cookie, name='dispatch')
# class LoginView(APIView):
#     permission_classes = [permissions.AllowAny]

#     def post(self, request, format=None):
#         data = self.request.data

#         username = data["username"]
#         password = data["password"]

#         try:
#             user = authenticate(request, username=username, password=password)

#             if user is not None:
#                 login(request, user)
#                 token = Token.objects.get_or_create(user=user)[0].key
#                 return Response({'success': True, 'token': token})
#             else:
#                 return Response({'error': 'Неверный логин и/или пароль'})
#         except: 
#             return Response({'error': 'Что-то пошло не так при попытке входа'})

# class LogoutView(APIView):
#     # permission_classes = [permissions.AllowAny]
#     def post(self, request, format=None):
#         try:
#             logout(request)
#             return Response({'success': 'Logged out'})
#         except:
#             return Response({'error': 'Что-то пошло не так при попытке выйти из аккаунта'})

# class CheckAuthenticationView(APIView):
#     permission_classes = [permissions.AllowAny]
#     def get(self, request, format=None):
#         try:
#             isAuthenticated = request.user.is_authenticated
#             print(isAuthenticated)
#             return Response({'isAuthenticated': isAuthenticated})
#         except:
#             return Response({'Error': "Что-то пошло не так при проверке аутентификации"})
