# Generated by Django 5.2.4 on 2025-07-26 16:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0020_remove_lecture_subject'),
    ]

    operations = [
        migrations.AlterField(
            model_name='lecture',
            name='title',
            field=models.TextField(),
        ),
        migrations.AlterField(
            model_name='lecture',
            name='video',
            field=models.URLField(blank=True, null=True),
        ),
    ]
