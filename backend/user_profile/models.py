from django.db import models
from django.contrib.auth.models import User
from courses.models import LessonPack, Lesson
import datetime

class UserProfile(models.Model):
    class Meta: 
        verbose_name = 'Профиль'
        verbose_name_plural = 'Профили'
    user = models.OneToOneField(User, verbose_name='Пользователь', null=True, blank=True, on_delete=models.CASCADE, related_name='profile')
    profile_image = models.ImageField('Аватар', default='default.jpg', upload_to='profile_pics', null=True, blank=True)
    birth_date = models.DateField('Дата рождения', null=True, blank=True, default=datetime.date.today)
    language_code = models.TextField('Язык', max_length=512, null=True, blank=True)
    status_text = models.TextField('Статус', max_length=512, null=True, blank=True)

    purchased_lessonPacks = models.ManyToManyField(LessonPack, verbose_name='Купленные уроки', blank=True, related_name='profiles')

    available_lessons = models.ManyToManyField(Lesson, verbose_name='Доступные уроки', blank=True, related_name='profiles')
    completed_lessons = models.ManyToManyField(Lesson, verbose_name='Пройденные уроки', blank=True, related_name='completed')
    lessons_on_review = models.ManyToManyField(Lesson, verbose_name='Уроки на ревью', blank=True, related_name='on_review')

    def __str__(self):
        return f"{self.id}: {self.user}"