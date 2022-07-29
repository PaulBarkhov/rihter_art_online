import hashlib
import hmac
import json
from collections.abc import MutableMapping
from django.shortcuts import render
from urllib.parse import urlencode, unquote
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from . import models
from courses.models import Lesson, LessonPack
from .import serilalizers
from courses.models import LessonPack
from django.conf import settings

class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            cart = models.Cart.objects.get(user=self.request.user)
            cart_items = cart.cart_items
            return Response(serilalizers.CartItemSerializer(cart_items, many=True).data)
        except models.Cart.DoesNotExist:
            return Response('')

    def post(self, request):
        try:
            cart = models.Cart.objects.get(user=self.request.user)
        except models.Cart.DoesNotExist:
            cart = models.Cart.objects.create(user=self.request.user)

        cartItems = self.request.data['cartItems']
        # models.CartItem.objects.filter(cart=cart).delete()
        for cartItem in cartItems:
            lessonPack = LessonPack.objects.get(id=cartItem['id'])
            models.CartItem.objects.update_or_create(ref=lessonPack, cart=cart)
        return Response(serilalizers.CartItemSerializer(cart.cart_items, many=True).data, 200)

class CartItemView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            cart = models.Cart.objects.get(user=self.request.user)
            lessonPack = LessonPack.objects.get(id=pk)
            cart_item = models.CartItem.objects.get(ref=lessonPack, cart=cart)
            cart_item.delete()
            return Response(serilalizers.CartItemSerializer(cart.cart_items, many=True).data, 200)
        except LessonPack.DoesNotExist:
            print('sdfsd')
            return Response('Something went wrong...', 500)

class PaymentView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
    
        # course_name = self.request.data['course_name']
        lessonPacks = self.request.data['lessonPacks']
        for lessonPack in lessonPacks:
            lessonPack['id'] = str(lessonPack['id'])
            lessonPack['sku'] = lessonPack.pop('id')
            lessonPack['name'] = lessonPack['course_name'] + ' Уроки ' + lessonPack['name']
            lessonPack['quantity'] = '1'
        key = settings.PRODAMUS_KEY
        url = 'https://rihter-art.payform.ru/'
        data = {
            'customer_phone': self.request.user.profile.phone_number,
            'customer_email': self.request.user.username,
            'products': lessonPacks,
            'do': 'pay',
            'currency': self.request.data['currency'].lower(),
            # 'urlReturn': 'https://rihter-art.ru/profile/',
            'urlSuccess': 'https://rihter-art.ru/payment-success/',
            'sys': 'rihterart',
        }

        data['signature'] = sign(data, key)
        link = url + '?' + urlencode(http_build_query(data))

        return Response(link)

def sign(data, secret_key):
    import hashlib
    import hmac
    import json

    # переводим все значения data в string c помощью кастомной функции deep_int_to_string (см ниже)
    deep_int_to_string(data)

    # переводим data в JSON, с сортировкой ключей в алфавитном порядке, без пробелом и экранируем бэкслеши
    data_json = json.dumps(data, sort_keys=True, ensure_ascii=False, separators=(',', ':')).replace("/", "\\/")

    # создаем подпись с помощью библиотеки hmac и возвращаем ее
    return hmac.new(secret_key.encode('utf8'), data_json.encode('utf8'), hashlib.sha256).hexdigest()

def deep_int_to_string(dictionary):
    for key, value in dictionary.items():
        if isinstance(value, MutableMapping):
            deep_int_to_string(value)
        elif isinstance(value, list) or isinstance(value, tuple):
            for k, v in enumerate(value):
                deep_int_to_string({str(k): v})
        else: dictionary[key] = str(value)
                
def http_build_query(dictionary, parent_key=False):
    items = []
    for key, value in dictionary.items():
        new_key = str(parent_key) + '[' + key + ']' if parent_key else key
        if isinstance(value, MutableMapping):
            items.extend(http_build_query(value, new_key).items())
        elif isinstance(value, list) or isinstance(value, tuple):
            for k, v in enumerate(value):
                items.extend(http_build_query({str(k): v}, new_key).items())
        else:
            items.append((new_key, value))
    return dict(items)
