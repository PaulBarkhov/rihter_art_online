from django.db import models
from django.contrib.auth.models import User
from courses.models import LessonPack, Lesson
import datetime

class UserProfile(models.Model):
    class Meta: 
        verbose_name = 'Профиль'
        verbose_name_plural = 'Профили'
    user = models.OneToOneField(User, verbose_name='Пользователь', null=True, on_delete=models.CASCADE, related_name='profile')
    phone_number = models.CharField('Номер телефона', default='', max_length=64)
    sex = models.CharField('Пол', max_length=9, choices=[('Мужcкой', 'Мужcкой'), ('Женский', 'Женский'), ('не указан', 'не указан')], default='не указан')
    birth_date = models.DateField('Дата рождения', null=True, blank=True)
    # language_code = models.TextField('Язык', max_length=512, null=True, blank=True)
    about_self = models.TextField('О себе', max_length=512, null=True, blank=True)

    purchased_lessonPacks = models.ManyToManyField(LessonPack, verbose_name='Купленные уроки', blank=True, related_name='profiles')

    available_lessons = models.ManyToManyField(Lesson, verbose_name='Доступные уроки', blank=True, related_name='profiles')
    completed_lessons = models.ManyToManyField(Lesson, verbose_name='Пройденные уроки', blank=True, related_name='completed')
    lessons_on_review = models.ManyToManyField(Lesson, verbose_name='Уроки на ревью', blank=True, related_name='on_review')

    profile_image = models.ImageField('Фото', default='default.jpg', upload_to='profile_pics', null=True, blank=True)
    thumbnail = models.ImageField('Thumbnail', default='default.jpg', upload_to='thumbnails', null=True, blank=True)


    def __str__(self):
        return f"{self.id}: {self.user}"