# Generated by Django 4.0.3 on 2022-04-21 15:01

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Verification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.CharField(max_length=64, verbose_name='email')),
                ('code', models.CharField(max_length=4, verbose_name='code')),
            ],
            options={
                'verbose_name': 'Код',
                'verbose_name_plural': 'Коды',
            },
        ),
    ]