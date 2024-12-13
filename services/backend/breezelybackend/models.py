from django.db import models


class User(models.Model):
    name = models.CharField(max_length=64)

    email = models.EmailField()
    thingsboard_password = models.CharField()
    thingsboard_id = models.BigIntegerField() # check thingsboard api for what type this is
    zitadel_id = models.BigIntegerField() # check zitadel api for what type this is
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
