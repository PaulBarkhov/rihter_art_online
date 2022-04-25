# Generated by Django 4.0.3 on 2022-04-17 17:18

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0010_delete_completedlesson'),
    ]

    operations = [
        migrations.AddField(
            model_name='course',
            name='draft',
            field=models.BooleanField(default=False, verbose_name='Черновик'),
        ),
        migrations.AlterField(
            model_name='lesson',
            name='lessonPack',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='lessons', to='courses.lessonpack', verbose_name='Группа уроков'),
        ),
        migrations.AlterField(
            model_name='lessonpack',
            name='course',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='lessonPacks', to='courses.course', verbose_name='Курс'),
        ),
    ]
