import hashlib
import hmac
import json
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
            cart_item = LessonPack.objects.get(id=pk).cart_item
            cart_item.delete()
            cart = cart_item.cart
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
            # 'customer_phone': '+79999999999',
            'customer_phone': self.request.user.profile.phone_number,
            'customer_email': self.request.user.email,
            'products': lessonPacks,
            'do': 'pay',
            'currency': self.request.data['currency'].lower(),
            # 'urlReturn': 'https://rihter-art.ru/profile/',
            'urlSuccess': 'https://rihter-art.ru/payment-success/',
            'sys': 'rihterart',
        }

        data_json = json.dumps(data, sort_keys=True, ensure_ascii=False, separators=(',', ':')).replace("/", "\\/")
        data['signature'] = hmac.new(key.encode('utf8'), data_json.encode('utf8'), hashlib.sha256).hexdigest()
        link = url + '?' + http_build_query(data)
        return Response(link)

def http_build_query(data, topkey = ''):
    from urllib.parse import quote
 
    if len(data) == 0:
        return ""
 
    result = ""
  
    if not type(data) is dict and not type(data) is list:
        result += "=" + quote (str(data)) + "&"
 
    # is a dictionary?
    if type (data) is dict:
        for key in data.keys():
            newkey = quote (key)
            if topkey != '':
                newkey = topkey + quote('[' + key + ']')
        
            if type(data[key]) is dict:
                result += http_build_query (data[key], newkey)
        
            elif type(data[key]) is list:
                i = 0
                for val in data[key]:
                #   result += newkey + quote('[' + str(i) + ']') + "=" + quote(str(val)) + "&"
                    for key, value in val.items():
                        # result += newkey + quote('[' + str(i) + ']') + quote('[' + key + ']') + "=" + quote("'" + value + "'") + "&"
                        result += newkey + quote('[' + str(i) + ']') + quote('[' + key + ']') + http_build_query(value) + "&"
                    i = i + 1
        
            # boolean should have special treatment as well
            elif type(data[key]) is bool:
                result += newkey + "=" + quote (str(int(data[key]))) + "&"
        
            # assume string (integers and floats work well)
            else:
                result += newkey + "=" + quote (str(data[key])) + "&"
 
    # remove the last '&'
    if (result) and (topkey == '') and (result[-1] == '&'):
        result = result[:-1]
    
    return result