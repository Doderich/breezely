from .lib import mergeDevicesAndTelemetry
from .models import Device, Room, User
from rest_framework import serializers




class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ("id", "name", "email", "thingsboard_id", "zitadel_id", "expo_push_token")

class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = ['device_id', 'id', 'name', 'type', 'assigned_room', 'user']

class RoomSerializer(serializers.ModelSerializer):
    devices = serializers.SerializerMethodField()
    class Meta:
        model = Room
        fields = ['id', 'name', 'user', 'devices']
        
    def get_devices(self, obj):
        devices = obj.devices.all()
        return MergedDevicesSerializer(mergeDevicesAndTelemetry(devices), many=True).data
    
class RoomCreateUpdateSerializer(serializers.ModelSerializer):
    devices = serializers.PrimaryKeyRelatedField(queryset=Device.objects.all(), many=True, write_only=True)
    class Meta:
        model = Room
        fields = ['id', 'name', 'user', 'devices']
    
class MergedDevicesSerializer(serializers.Serializer):
    device = DeviceSerializer()
    telemetry = serializers.JSONField()