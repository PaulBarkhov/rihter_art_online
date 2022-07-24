# Generated by Django 4.0.3 on 2022-06-24 05:26

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('courses', '0023_excersize'),
    ]

    operations = [
        migrations.CreateModel(
            name='ExcersizeMessage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.TextField(blank=True, max_length=5000, verbose_name='Содержание')),
                ('voice', models.FileField(null=True, upload_to='voice_messages/')),
                ('excersize', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='excersize_messages', to='courses.excersize', verbose_name='Задание')),
                ('user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='excersize_messages', to=settings.AUTH_USER_MODEL, verbose_name='Пользователь')),
            ],
            options={
                'verbose_name': 'Сообщение в задании',
                'verbose_name_plural': 'Сообщения в заданиях',
            },
        ),
    ]
