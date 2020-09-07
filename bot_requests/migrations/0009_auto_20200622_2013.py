# Generated by Django 3.0.6 on 2020-06-22 20:13

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('bot_requests', '0008_importclassificationrequest'),
    ]

    operations = [
        migrations.RenameField(
            model_name='importclassificationrequest',
            old_name='classificationtype',
            new_name='classification_type',
        ),
        migrations.CreateModel(
            name='UCIrankingRequest',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('entry_time', models.DateTimeField()),
                ('process_start_time', models.DateTimeField(blank=True, null=True)),
                ('process_end_time', models.DateTimeField(blank=True, null=True)),
                ('status', models.CharField(default='pending', max_length=70)),
                ('routine', models.CharField(max_length=100)),
                ('item_id', models.CharField(max_length=70)),
                ('result_file_name', models.CharField(max_length=100)),
                ('year', models.IntegerField()),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='TeamRequest',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('entry_time', models.DateTimeField()),
                ('process_start_time', models.DateTimeField(blank=True, null=True)),
                ('process_end_time', models.DateTimeField(blank=True, null=True)),
                ('status', models.CharField(default='pending', max_length=70)),
                ('routine', models.CharField(max_length=100)),
                ('item_id', models.CharField(max_length=70)),
                ('year', models.IntegerField()),
                ('nationality', models.CharField(blank=True, max_length=3)),
                ('UCIcode', models.CharField(blank=True, max_length=3)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='StartListRequest',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('entry_time', models.DateTimeField()),
                ('process_start_time', models.DateTimeField(blank=True, null=True)),
                ('process_end_time', models.DateTimeField(blank=True, null=True)),
                ('status', models.CharField(default='pending', max_length=70)),
                ('routine', models.CharField(max_length=100)),
                ('item_id', models.CharField(max_length=70)),
                ('result_file_name', models.CharField(max_length=100)),
                ('time_of_race', models.DateTimeField()),
                ('race_type', models.BooleanField()),
                ('chrono', models.BooleanField()),
                ('moment', models.BooleanField()),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='StagesRequest',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('entry_time', models.DateTimeField()),
                ('process_start_time', models.DateTimeField(blank=True, null=True)),
                ('process_end_time', models.DateTimeField(blank=True, null=True)),
                ('status', models.CharField(default='pending', max_length=70)),
                ('routine', models.CharField(max_length=100)),
                ('item_id', models.CharField(max_length=70)),
                ('prologue', models.BooleanField()),
                ('last_stage', models.IntegerField()),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='SortNameRequest',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('entry_time', models.DateTimeField()),
                ('process_start_time', models.DateTimeField(blank=True, null=True)),
                ('process_end_time', models.DateTimeField(blank=True, null=True)),
                ('status', models.CharField(default='pending', max_length=70)),
                ('routine', models.CharField(max_length=100)),
                ('item_id', models.CharField(max_length=70)),
                ('prop', models.IntegerField()),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='SortDateRequest',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('entry_time', models.DateTimeField()),
                ('process_start_time', models.DateTimeField(blank=True, null=True)),
                ('process_end_time', models.DateTimeField(blank=True, null=True)),
                ('status', models.CharField(default='pending', max_length=70)),
                ('routine', models.CharField(max_length=100)),
                ('item_id', models.CharField(max_length=70)),
                ('prop', models.IntegerField()),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='RaceRequest',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('entry_time', models.DateTimeField()),
                ('process_start_time', models.DateTimeField(blank=True, null=True)),
                ('process_end_time', models.DateTimeField(blank=True, null=True)),
                ('status', models.CharField(default='pending', max_length=70)),
                ('routine', models.CharField(max_length=100)),
                ('item_id', models.CharField(max_length=70)),
                ('time_of_race', models.DateTimeField()),
                ('end_of_race', models.DateTimeField()),
                ('nationality', models.CharField(blank=True, max_length=3)),
                ('race_type', models.BooleanField()),
                ('race_class', models.CharField(blank=True, max_length=20)),
                ('create_stages', models.BooleanField()),
                ('prologue', models.BooleanField()),
                ('last_stage', models.IntegerField()),
                ('edition_nr', models.IntegerField()),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='NationalOneChampRequest',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('entry_time', models.DateTimeField()),
                ('process_start_time', models.DateTimeField(blank=True, null=True)),
                ('process_end_time', models.DateTimeField(blank=True, null=True)),
                ('status', models.CharField(default='pending', max_length=70)),
                ('routine', models.CharField(max_length=100)),
                ('item_id', models.CharField(max_length=70)),
                ('nationality', models.CharField(blank=True, max_length=3)),
                ('year_begin', models.IntegerField()),
                ('year_end', models.IntegerField()),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='NationalAllChampsRequest',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('entry_time', models.DateTimeField()),
                ('process_start_time', models.DateTimeField(blank=True, null=True)),
                ('process_end_time', models.DateTimeField(blank=True, null=True)),
                ('status', models.CharField(default='pending', max_length=70)),
                ('routine', models.CharField(max_length=100)),
                ('item_id', models.CharField(max_length=70)),
                ('year', models.IntegerField()),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
