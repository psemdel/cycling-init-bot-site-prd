# Generated by Django 3.0.6 on 2020-11-15 14:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bot_requests', '0005_ucirankingrequest_gender'),
    ]

    operations = [
        migrations.AddField(
            model_name='ucirankingrequest',
            name='UCIranking',
            field=models.BooleanField(default=False),
        ),
    ]