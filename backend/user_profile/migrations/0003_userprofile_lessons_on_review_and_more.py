# Generated by Django 4.0.3 on 2022-04-08 06:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0010_delete_completedlesson'),
        ('user_profile', '0002_userprofile_completed_lessons'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='lessons_on_review',
            field=models.ManyToManyField(blank=True, related_name='on_review', to='courses.lesson', verbose_name='Уроки на ревью'),
        ),
        migrations.AlterField(
            model_name='userprofile',
            name='completed_lessons',
            field=models.ManyToManyField(blank=True, related_name='completed', to='courses.lesson', verbose_name='Пройденные уроки'),
        ),
    ]
