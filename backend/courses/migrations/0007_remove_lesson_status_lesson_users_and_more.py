# Generated by Django 4.0.3 on 2022-04-07 15:55

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('courses', '0006_remove_lessonstatus_lesson_lesson_status'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='lesson',
            name='status',
        ),
        migrations.AddField(
            model_name='lesson',
            name='users',
            field=models.ManyToManyField(through='courses.LessonStatus', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='lessonstatus',
            name='lessons',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='status', to='courses.lesson'),
        ),
        migrations.RemoveField(
            model_name='lessonstatus',
            name='user',
        ),
        migrations.AddField(
            model_name='lessonstatus',
            name='user',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='status', to=settings.AUTH_USER_MODEL),
        ),
    ]