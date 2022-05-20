# Generated by Django 4.0.3 on 2022-05-16 17:58

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0017_comment_date'),
    ]

    operations = [
        migrations.CreateModel(
            name='VoiceMessage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('blob', models.BinaryField()),
            ],
            options={
                'verbose_name': 'Голосовое сообщение',
                'verbose_name_plural': 'Голосовые сообщения',
            },
        ),
        migrations.AlterField(
            model_name='comment',
            name='parent',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='children', to='courses.comment', verbose_name='Родитель'),
        ),
    ]
