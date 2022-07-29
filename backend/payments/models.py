from django.db import models
from django.contrib.auth.models import User
from djmoney.models.fields import MoneyField

# Create your models here.

class Cart(models.Model):
    class Meta: 
        verbose_name = 'Корзина'
        verbose_name_plural = 'Корзины'
    user = models.ForeignKey(User, verbose_name='Пользователь', null=True, on_delete=models.CASCADE, blank=True, related_name='carts')

    def __str__(self):
        return f"{self.user}"
    
class CartItem(models.Model):
    class Meta: 
        verbose_name = 'Товар в корзине'
        verbose_name_plural = 'Товары в корзине'
    ref = models.ForeignKey('courses.LessonPack', verbose_name='Референс к товару', on_delete=models.CASCADE, blank=True, null=True, related_name='cart_item')
    # name = models.CharField('Название', max_length=64, blank=True)
    # price = MoneyField(max_digits=14, decimal_places=2, default_currency='RUB', null=True)
    cart = models.ForeignKey(Cart, verbose_name='Корзина', null=True, on_delete=models.CASCADE, blank=True, related_name='cart_items')

    def __str__(self):
        return f"{self.ref}"