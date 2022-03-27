from django.db import models
from django.contrib.auth.models import User

class Course(models.Model):
    class Meta: 
        verbose_name = 'Курс'
        verbose_name_plural = 'Курсы'
    name = models.CharField('Название', max_length=64, blank=True)
    description = models.TextField('Описание', max_length=512, null=True, blank=True)
    preview = models.ImageField('Фото', upload_to='uploads/previews', null=True, blank=True)

    def get_free_lessons(self):
        return self.lessons_set.filter(access='free')

    def __str__(self):
        return f"{self.id}: {self.name}"

class LessonPack(models.Model):
    class Meta: 
        verbose_name = 'Группа уроков'
        verbose_name_plural = 'Группы уроков'
    name = models.CharField('Название', max_length=64, blank=True)
    course = models.ForeignKey(Course, verbose_name='Описание', null=True, on_delete=models.CASCADE, blank=True, related_name='lessonPacks')
    price = models.DecimalField('Цена', max_digits=6, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return f"{self.course} - {self.name}"


class Lesson(models.Model):
    class Meta: 
        verbose_name = 'Урок'
        verbose_name_plural = 'Уроки'
    course = models.ForeignKey(Course, verbose_name='Курс', null=True, on_delete=models.CASCADE, blank=True, related_name='lessons')
    lessonPack = models.ForeignKey(LessonPack, verbose_name='Уроки', null=True, on_delete=models.CASCADE, blank=True, related_name='lessons')
    name = models.CharField('Название', max_length=64, blank=True)
    description = models.TextField('Описание', null=True, max_length=512, blank=True)
    video = models.CharField('Видео(url)', max_length=512, null=True, blank=True)
    excersize = models.CharField('Задание', null=True, max_length=512, blank=True)
    access = models.CharField('Доступ', null=True, max_length=4, choices=[('free', 'бесплатно'), ('paid', 'платно')], default='free')

    def __str__(self):
        return f"{self.id}: {self.name}, {self.lessonPack}"


class Comment(models.Model):
    class Meta: 
        verbose_name = 'Комментарий'
        verbose_name_plural = 'Комментарии'
    text = models.TextField('Содержание', max_length=512, blank=True)
    lesson = models.ForeignKey(Lesson, verbose_name='Урок', null=True, on_delete=models.CASCADE, blank=True, related_name='comments')
    user = models.ForeignKey(User, verbose_name='Пользователь', null=True, on_delete=models.CASCADE, blank=True, related_name='comments')

    def __str__(self):
        return f"{self.id}: {self.user}: {self.text}"


class Photo(models.Model):
    class Meta: 
        verbose_name = 'Фотография'
        verbose_name_plural = 'Фотографии'
    lesson = models.ForeignKey(Lesson, verbose_name='Урок', null=True, on_delete=models.CASCADE, blank=True, related_name='photos')
    name = models.CharField('Название', max_length=64, blank=True)
    url = models.ImageField('URL', null=True, upload_to='uploads/photos', blank=True)

    def __str__(self):
        return f"{self.id}: {self.name}"

class Order(models.Model):
    class Meta: 
        verbose_name = 'Заказ'
        verbose_name_plural = 'Заказы'
    user = models.ForeignKey(User, verbose_name='Пользователь', on_delete=models.CASCADE, related_name="orders")
    course = models.ForeignKey(Course, verbose_name='Курс', on_delete=models.CASCADE, related_name="orders")
    number_of_lessons = models.IntegerField('Количество уроков', )
    status = models.CharField('Статус', max_length=64)
