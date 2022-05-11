from django.dispatch import receiver
from .models import UserProfile
from djoser.signals import user_registered

@receiver(user_registered)
def my_handler(user, request, **kwargs):
    data = request.data
    user.first_name = data['first_name']
    user.last_name = data['last_name']
    user.save()
    UserProfile.objects.create(user=user)
