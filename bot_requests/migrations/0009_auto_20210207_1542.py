# Generated by Django 3.0.6 on 2021-02-07 15:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bot_requests', '0008_nationalteamallrequest'),
    ]

    operations = [
        migrations.AddField(
            model_name='nationalteamallrequest',
            name='category',
            field=models.CharField(blank=True, max_length=10),
        ),
        migrations.AddField(
            model_name='nationalteamrequest',
            name='category',
            field=models.CharField(blank=True, max_length=10),
        ),
    ]
