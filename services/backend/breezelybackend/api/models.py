from django.db import models

DEVICE_TYPES = [
    ("Window", "window"),
    ("Door", "door")
]

class BaseClass(models.Model):
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    class Meta:
            abstract = True

class User(BaseClass):
    name = models.CharField(max_length=64)
    email = models.EmailField(null=True)
    thingsboard_id = models.CharField(max_length=128) # check thingsboard api for what type this is
    zitadel_id = models.CharField(max_length=128) # check zitadel api for what type this is
    expo_push_token = models.CharField(max_length=128, blank=True)
    
class Room(BaseClass):
    name = models.CharField(max_length=64)
    user = models.ForeignKey(User, related_name="rooms", on_delete=models.CASCADE)

class Device(BaseClass):
    device_id = models.CharField(max_length=128)
    name = models.CharField(max_length=128)
    type = models.CharField(choices=DEVICE_TYPES, max_length=7)
    assigned_room = models.ForeignKey(Room, related_name="devices", on_delete=models.SET_NULL, null=True)
    user = models.ForeignKey(User, related_name="devices", on_delete=models.CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["device_id"], name="unique_device_id")
        ]
