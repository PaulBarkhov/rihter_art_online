# Generated by Django 4.0.3 on 2022-07-28 12:26

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0037_reviewmessageimage_image'),
        ('payments', '0004_remove_cartitem_name_remove_cartitem_price_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cartitem',
            name='ref',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='cart_item', to='courses.lessonpack', verbose_name='Референс к товару'),
        ),
    ]