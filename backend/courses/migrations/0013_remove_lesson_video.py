# Generated by Django 4.0.3 on 2022-04-20 06:20

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0012_alter_photo_lesson_video'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='lesson',
            name='video',
        ),
    ]
