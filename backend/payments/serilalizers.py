from rest_framework.serializers import Serializer, ModelSerializer, SlugRelatedField, SerializerMethodField, FloatField, DateTimeField, CharField
from courses.serializers import LessonGroupSerializer
from . import models

class CartItemSerializer(ModelSerializer):
    ref = LessonGroupSerializer(read_only=True)
    class Meta:
        model = models.CartItem
        fields = ('__all__')

class CartSerializer(ModelSerializer):
    cart_items = CartItemSerializer(read_only=True, many=True)
    class Meta:
        model = models.Cart
        fields = ('__all__')