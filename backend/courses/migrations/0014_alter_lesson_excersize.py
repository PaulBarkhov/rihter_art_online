# Generated by Django 4.0.3 on 2022-05-11 14:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0013_remove_lesson_video'),
    ]

    operations = [
        migrations.AlterField(
            model_name='lesson',
            name='excersize',
            field=models.TextField(blank=True, null=True, verbose_name='Задание'),
        ),
    ]
