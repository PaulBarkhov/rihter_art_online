# Generated by Django 4.0.3 on 2022-04-27 13:34

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('user_profile', '0005_rename_availvable_lessons_userprofile_available_lessons'),
    ]

    operations = [
        migrations.RenameField(
            model_name='userprofile',
            old_name='language',
            new_name='language_code',
        ),
        migrations.RenameField(
            model_name='userprofile',
            old_name='status',
            new_name='status_text',
        ),
    ]