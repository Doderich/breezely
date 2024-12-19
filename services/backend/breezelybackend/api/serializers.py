from .models import Device, User
from rest_framework import serializers




class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ("id", "name", "email", "thingsboard_id", "thingsboard_password", "zitadel_id", "expo_push_token")

class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = ['device_id', 'id', 'name', 'type', 'assigned_room', 'user']

class MergedDevicesSerializer(serializers.Serializer):
    device = DeviceSerializer()
    telemetry = serializers.JSONField()