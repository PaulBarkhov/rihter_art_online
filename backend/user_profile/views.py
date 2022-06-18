from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import UserProfile
from .serializers import UserProfileSerializer

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = self.request.user
        user_profile = UserProfile.objects.get(user=user)
        user_profile = UserProfileSerializer(user_profile).data
        return Response({
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'profile_image': user_profile['profile_image'],
            'about_self': user_profile['about_self'],
            'birth_date': user_profile['birth_date'],
            'sex': user_profile['sex'],
            'phone_number': user_profile['phone_number']
        })


class UpdateProfileView(APIView):
    # permission_classes = [IsAuthenticated]
    def post(self, request, format=None):
        # try:
        user = self.request.user
        data = self.request.data
        user.first_name=data['first_name']
        user.last_name=data['last_name']
        user.save()

        profile = self.request.user.profile
        profile.about_self=data['about_self']
        if not data['birth_date']:
            print('no date')
            profile.birth_date=None
        else:
            print('date: ' + data['birth_date'])
            profile.birth_date=data['birth_date']
        profile.sex=data['sex']
        profile.phone_number=data['phone_number']
        profile.save()
        return Response(data=None, status=200)
        # except:
        #     return Response({ 'Error': 'Something whent wrong when updating profile'}, status=500)

class UpdateProfileImage(APIView):
    def post(self, request, format=None):
        user = self.request.user
        data = self.request.data
        profile = self.request.user.profile
        profile.profile_image=data['profile_image']
        profile.thumbnail=data['thumbnail']
        profile.save()
        return Response(data=None, status=200)
