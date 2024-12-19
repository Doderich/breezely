from .models import Device, User
from rest_framework import serializers




class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['name', 'thingsboard_id', 'zitadel_id', 'email', 'expo_push_token']

class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = ['device_id', 'id', 'name', 'type', 'assigned_room', 'user']