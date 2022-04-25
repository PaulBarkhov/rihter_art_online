from django.db import models

# Create your models here.

class Verification(models.Model):
    class Meta:
        verbose_name = 'Код'
        verbose_name_plural = 'Коды'

    email = models.CharField('email', max_length=64)
    code = models.CharField('code', max_length=4)

    def __str__(self):
        return f"{self.email}: {self.code}"