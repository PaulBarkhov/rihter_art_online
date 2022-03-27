from rest_framework.views import APIView
from rest_framework.response import Response
from .models import UserProfile
from .serializers import UserProfileSerializer

class GetUserProfileView(APIView):
    def get(self, request, format=None):
            user = self.request.user
            username = user.username

            user_profile = UserProfile.objects.get(user=user)
            user_profile = UserProfileSerializer(user_profile)

            return Response({ 'profile': user_profile.data, 'username': str(username) })
        # try:
        #     user = self.request.user
        #     username = user.username

        #     profile = Profile.objects.get(user=user)
        #     profile = ProfileSerializer(profile)

        #     return Response({ 'profile': profile.data })
        # except:
        #     return Response({ 'Error': 'Something went wrong when retrieving profile'})

class UpdateUserProfile(APIView):
    def put(self, request, format=None):
        try:
            user = self.request.user
            data = self.request.data

            first_name = data['first_name']
            last_name = data['last_name']

            user.update(first_name=first_name, last_name=last_name)
        except:
            return Response({ 'Error': 'Something whent wrong when updating profile'})
