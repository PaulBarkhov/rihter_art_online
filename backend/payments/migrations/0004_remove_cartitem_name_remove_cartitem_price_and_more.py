# Generated by Django 4.0.3 on 2022-07-26 16:38

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('payments', '0003_rename_packref_cartitem_ref'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='cartitem',
            name='name',
        ),
        migrations.RemoveField(
            model_name='cartitem',
            name='price',
        ),
        migrations.RemoveField(
            model_name='cartitem',
            name='price_currency',
        ),
    ]
