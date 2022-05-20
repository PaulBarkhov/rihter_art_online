# Generated by Django 4.0.3 on 2022-05-07 12:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_profile', '0015_userprofile_sex'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userprofile',
            name='status_text',
        ),
        migrations.AddField(
            model_name='userprofile',
            name='about_self',
            field=models.TextField(blank=True, max_length=512, null=True, verbose_name='О себе'),
        ),
        migrations.AlterField(
            model_name='userprofile',
            name='birth_date',
            field=models.DateField(blank=True, null=True, verbose_name='Дата рождения'),
        ),
    ]