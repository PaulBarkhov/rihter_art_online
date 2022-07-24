from django.db import models
from django.contrib.auth.models import User
from ckeditor.fields import RichTextField
from djmoney.models.fields import MoneyField

class Course(models.Model):
    class Meta: 
        verbose_name = 'Курс'
        verbose_name_plural = 'Курсы'
    name = models.CharField('Название', max_length=64, blank=True)
    description = models.TextField('Описание', max_length=512, null=True, blank=True)
    preview = models.ImageField('Фото', upload_to='uploads/previews', null=True, blank=True)
    draft = models.BooleanField('Черновик', default=False)

    def get_min_price(self):
        return self.lessonPacks.all().aggregate(models.Min('price'))['price__min']

    @property
    def currency(self):
        if self.lessonPacks.first():
            return self.lessonPacks.first().price_currency
        else: 
            return ''

    def __str__(self):
        return f"{self.id}: {self.name}"

class LessonPack(models.Model):
    class Meta: 
        verbose_name = 'Группа уроков'
        verbose_name_plural = 'Группы уроков'
    name = models.CharField('Название', max_length=64, blank=True)
    course = models.ForeignKey(Course, verbose_name='Курс', null=True, on_delete=models.CASCADE, blank=True, related_name='lessonPacks')
    price = MoneyField(max_digits=14, decimal_places=2, default_currency='RUB', null=True)

    @property
    def get_course_name(self):
        return self.course.name

    def __str__(self):
        return f"{self.course} - {self.name}"

class Lesson(models.Model):
    class Meta: 
        verbose_name = 'Урок'
        verbose_name_plural = 'Уроки'
    course = models.ForeignKey(Course, verbose_name='Курс', null=True, on_delete=models.CASCADE, blank=True, related_name='lessons')
    lessonPack = models.ForeignKey(LessonPack, verbose_name='Группа уроков', null=True, on_delete=models.CASCADE, blank=True, related_name='lessons')
    name = models.CharField('Название', max_length=64, blank=True)
    description = models.TextField('Описание', null=True, max_length=512, blank=True)
    # excersize_text = RichTextField('Задание', null=True, blank=True)
    access = models.CharField('Доступ', null=True, max_length=4, choices=[('free', 'бесплатно'), ('paid', 'платно')], default='free')
    preview = models.ImageField('Фото', upload_to='uploads/lessons/previews', null=True, blank=True)
    
    def __str__(self):
        return f"{self.id}: {self.name}, {self.lessonPack}"

class Excersize(models.Model):
    class Meta:
        verbose_name = 'Задание'
        verbose_name_plural = 'Задания'
    lesson = models.ForeignKey(Lesson, verbose_name='Урок', null=True, on_delete=models.CASCADE, blank=True, related_name='excersizes')
    text = RichTextField('Задание', null=True, blank=True)

    def __str__(self):
        return f"{self.id}: {self.lesson}"


class Review(models.Model):
    class Meta:
        verbose_name = 'Ревью'
        verbose_name_plural = 'Ревью'

    excersize = models.ForeignKey(Excersize, verbose_name='Задание', null=True, on_delete=models.CASCADE, blank=True, related_name='reviews')
    profile = models.ForeignKey('user_profile.UserProfile', verbose_name='Пользователь', null=True, on_delete=models.CASCADE, blank=True, related_name='reviews')
    status_options = [
        ('none', 'none'),
        ('onReview', 'onReview'),
        ('completed', 'completed')
    ]
    status = models.CharField(max_length=9, choices=status_options, default='none')


class ReviewMessage(models.Model):
    class Meta:
        verbose_name = 'Сообщение в ревью'
        verbose_name_plural = 'Сообщения в ревью'
    review = models.ForeignKey(Review, verbose_name='Ревью', null=True, on_delete=models.CASCADE, blank=True, related_name='review_messages')
    user = models.ForeignKey(User, verbose_name='Пользователь', null=True, on_delete=models.CASCADE, blank=True, related_name='review_messages')
    text = models.TextField('Содержание', max_length=5000, blank=True)
    voice = models.FileField(upload_to='voice_messages/', null=True)
    parent = models.ForeignKey('self', verbose_name='Родитель', on_delete=models.SET_NULL, blank=True, null=True, related_name='children')
    date = models.DateTimeField(auto_now_add=True, blank=True, null=True)

class ReviewMessageImage(models.Model):
    class Meta: 
        verbose_name = 'Фото в сообщении задания'
        verbose_name_plural = 'Фото в сообщении задания'
    reviewMessage = models.ForeignKey(ReviewMessage, verbose_name='Сообщение', null=True, on_delete=models.CASCADE, blank=True, related_name='review_message_images')
    user = models.ForeignKey(User, verbose_name='Пользователь', null=True, on_delete=models.CASCADE, blank=True, related_name='review_message_images')

class Comment(models.Model):
    class Meta: 
        verbose_name = 'Комментарий'
        verbose_name_plural = 'Комментарии'
    text = models.TextField('Содержание', max_length=5000, blank=True)
    voice = models.FileField(upload_to='voice_messages/', null=True)
    lesson = models.ForeignKey(Lesson, verbose_name='Урок', null=True, on_delete=models.CASCADE, blank=True, related_name='comments')
    user = models.ForeignKey(User, verbose_name='Пользователь', null=True, on_delete=models.CASCADE, blank=True, related_name='comments')
    parent = models.ForeignKey('self', verbose_name='Родитель', on_delete=models.SET_NULL, blank=True, null=True, related_name='children')
    date = models.DateTimeField(auto_now_add=True, blank=True, null=True)

    def __str__(self):
        return f"{self.id}: {self.user}: {self.text}"

class CommentImage(models.Model):
    class Meta: 
        verbose_name = 'Фото в комментарии'
        verbose_name_plural = 'Фото в комментарии'
    comment = models.ForeignKey(Comment, verbose_name='Коммент', null=True, on_delete=models.CASCADE, blank=True, related_name='comment_images')
    user = models.ForeignKey(User, verbose_name='Пользователь', null=True, on_delete=models.CASCADE, blank=True, related_name='comment_images')

class VoiceMessage(models.Model):
    class Meta:
        verbose_name = 'Голосовое сообщение'
        verbose_name_plural = 'Голосовые сообщения'
    blob = models.FileField(upload_to='voice_messages/', null=True)
    # blob = models.BinaryField(max_length=None, null=True)
    # file = models.FileField(upload_to='voice_messages/', null=True)


class Photo(models.Model):
    class Meta: 
        verbose_name = 'Фотография'
        verbose_name_plural = 'Фотографии'
    lesson = models.ForeignKey(Lesson, verbose_name='Урок', null=True, on_delete=models.SET_NULL, blank=True, related_name='photos')
    name = models.CharField('Название', max_length=64, blank=True)
    url = models.ImageField('URL', null=True, upload_to='uploads/photos', blank=True)

    def __str__(self):
        return f"{self.id}: {self.name}"

class Video(models.Model):
    class Meta:
        verbose_name = 'Видео'
        verbose_name_plural = 'Видео'
    name = models.CharField('Название', max_length=64)
    url = models.CharField('ID с Вимео', max_length=64)
    lesson = models.ForeignKey(Lesson, verbose_name='Урок', null=True, on_delete=models.SET_NULL, blank=True, related_name='videos')

class Order(models.Model):
    class Meta: 
        verbose_name = 'Заказ'
        verbose_name_plural = 'Заказы'
    user = models.ForeignKey(User, verbose_name='Пользователь', on_delete=models.CASCADE, related_name="orders")
    course = models.ForeignKey(Course, verbose_name='Курс', on_delete=models.CASCADE, related_name="orders")
    number_of_lessons = models.IntegerField('Количество уроков', )
    status = models.CharField('Статус', max_length=64)

class RatingStar(models.Model):
    class Meta:
        verbose_name = 'Звезда рейтинга'
        verbose_name_plural = 'Звезды рейтинга'
    value = models.SmallIntegerField('Значение', default=0)

class Rating(models.Model):
    class Meta:
        verbose_name = 'Рейтинг'
        verbose_name_plural = 'Рейтинги'
    ip = models.CharField('IP', max_length=15)
    star = models.ForeignKey(RatingStar, on_delete=models.CASCADE, verbose_name='Звезда', related_name='Rating')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, verbose_name='Курс', related_name='Rating')
