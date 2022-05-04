# Generated by Django 4.0.3 on 2022-04-07 15:43

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('courses', '0004_ratingstar_rating'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='lessonstatus',
            name='lesson',
        ),
        migrations.AddField(
            model_name='lessonstatus',
            name='lesson',
            field=models.ManyToManyField(related_name='status', to='courses.lesson'),
        ),
        migrations.RemoveField(
            model_name='lessonstatus',
            name='user',
        ),
        migrations.AddField(
            model_name='lessonstatus',
            name='user',
            field=models.ManyToManyField(related_name='status', to=settings.AUTH_USER_MODEL),
        ),
    ]