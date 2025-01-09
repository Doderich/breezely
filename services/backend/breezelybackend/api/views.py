from rest_framework.generics import GenericAPIView
from datetime import datetime

from .lib import get_user_from_request, merge_devices_and_telemetry

from .serializers import DeviceSerializer, MergedDevicesSerializer, RoomCreateUpdateSerializer, RoomSerializer, UserSerializer
from .models import Device, Room, User


from ..custom_resource_protector import CustomResourceProtector
from .. import validator
from ..helpers import thingsboard_helpers, expo_push_helpers
from rest_framework.response import Response
from rest_framework import status

require_auth = CustomResourceProtector()
require_auth.register_token_validator(validator.ZitadelIntrospectTokenValidator())



class ThingboardAPIView(GenericAPIView):

    @require_auth(scopes=None)
    def get(self, request):

        client = thingsboard_helpers.ThingsboardAPIHelper()
        current_user = client.retrieve_current_user()
        return Response(data=current_user, status=status.HTTP_200_OK)
        
        
class ThingsBoardClientView(GenericAPIView):
    @require_auth(scopes=None)
    def get(self, request):
        
        client = thingsboard_helpers.ThingsBoardClient().client
        res = client.get_user()
        return Response(data=res.to_dict(),
                        status=status.HTTP_200_OK)
        


class UserInfoView(GenericAPIView):
    @require_auth(scopes=None)
    def get(self, request):
        token = request.oauth_token
        print(token)
        user = User.objects.filter(zitadel_id=token.get("sub")).first()
        if not user:
            return Response(data={"details": "User not found"},
                            status=status.HTTP_404_NOT_FOUND)
        return Response(data=UserSerializer(user).data,
                        status=status.HTTP_200_OK)

class PushTokenView(GenericAPIView):
    @require_auth(scopes=None)
    def post(self, request):
        query = User.objects.filter(zitadel_id=request.oauth_token.get("sub"))
        if query.exists():
            print(f"Query result: {query.first().__dict__}")
            query.update(expo_push_token=request.data.get("expo_push_token"))
            return Response(data={"details": "User updated"},
                            status=status.HTTP_200_OK)
        else:
            return Response(data={"details": "User not found"},
                            status=status.HTTP_404_NOT_FOUND)
            
class DevicesView(GenericAPIView):
    @require_auth(scopes=None)
    def get(self, request):
        user = get_user_from_request(request)
        print(f"Authenticated User: {user}")

        # Fetch all devices for the user
        devices = Device.objects.filter(user=user)
        if not devices:
            return Response(data={"devices": []}, status=status.HTTP_200_OK)

        # Merge devices and telemetry data
        merged_devices = merge_devices_and_telemetry(devices)

        # Serialize the merged devices
        merged_devices_ser = MergedDevicesSerializer(instance=merged_devices, many=True)
        
        # Return serialized data
        return Response(data=merged_devices_ser.data, status=status.HTTP_200_OK)

        
    @require_auth(scopes=None)
    def post(self, request):
        user = get_user_from_request(request)
        client = thingsboard_helpers.ThingsBoardClient().client
        data = request.data
        data["user"] = user.id

        try:
            tb_device = client.get_tenant_device(device_name=data["device_id"])
            print(tb_device)
        except Exception as e:
            print(e)
            return Response(data={"details": "Device not found"},
                            status=status.HTTP_404_NOT_FOUND)
            
        data["device_id"] = tb_device.id.id
        device = DeviceSerializer(data=data)
        if not device.is_valid(raise_exception=True):
            return Response(data=device.errors,
                            status=status.HTTP_400_BAD_REQUEST)
        try:
            print("Assigning device")
            client.assign_device_to_customer(user.thingsboard_id, device.validated_data.get('device_id'))
            telemetry = client.telemetry_controller.get_latest_timeseries_using_get("DEVICE", device.validated_data.get('device_id'))
        except Exception as e:
            print(e)
            return Response(data={"details": "Failed to assign device to user"},
                            status=status.HTTP_400_BAD_REQUEST)
        device.save()
        return Response(data={"device": device.data, "telemetry": telemetry},
                        status=status.HTTP_201_CREATED)
        
        
DEVICE_NOT_FOUND = "Device not found"

class DeviceView(GenericAPIView):
    @require_auth(scopes=None)
    def get(self, request, device_id):
        user = get_user_from_request(request)
        device = Device.objects.filter(id=device_id, user=user).first()
        if not device:
            return Response(data={"details": DEVICE_NOT_FOUND},
                            status=status.HTTP_404_NOT_FOUND)
        client = thingsboard_helpers.ThingsBoardClient().client
        try:
            deviceInfo = client.get_device_info_by_id(device_id=device.device_id)
            print(deviceInfo)
            telemetry = client.telemetry_controller.get_latest_timeseries_using_get("DEVICE", device.device_id)
            telemetry['active'] = {
                "value": deviceInfo.active,
                "ts":datetime.now()
            }
        except Exception as e:
            print(e)
            return Response(data={"details": "Failed to retrieve telemetry data"},
                            status=status.HTTP_400_BAD_REQUEST)
        return Response(data={"device": DeviceSerializer(device).data, "telemetry": telemetry},
                        status=status.HTTP_200_OK)
    @require_auth(scopes=None)    
    def put(self, request, device_id):
        user = get_user_from_request(request)
        device = Device.objects.filter(id=device_id, user=user).first()
        if not device:
            return Response(data={"details": DEVICE_NOT_FOUND},
                            status=status.HTTP_404_NOT_FOUND)
        device_data = {**request.data, "user": user.id}
        device_serializer = DeviceSerializer(device, data=device_data)
        if not device_serializer.is_valid(raise_exception=True):
            return Response(data=device_serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)
        device_serializer.save()
        return Response(data=device_serializer.data,
                        status=status.HTTP_200_OK)
    @require_auth(scopes=None)
    def delete(self, request, device_id):
        user = get_user_from_request(request)
        device = Device.objects.filter(id=device_id, user=user).first()
        if not device:
            return Response(data={"details": DEVICE_NOT_FOUND},
                            status=status.HTTP_404_NOT_FOUND)
        client = thingsboard_helpers.ThingsBoardClient().client
        try:
            client.unassign_device_from_customer(device.device_id)
        except Exception as e:
            print(e)
        device.delete()
        return Response(data={"details": "Device deleted"},
                        status=status.HTTP_200_OK)
        
        
        
class RoomsView(GenericAPIView):
    @require_auth(scopes=None)
    def get(self, request):
        user = get_user_from_request(request)
        if not user.rooms:
            return Response(data={RoomSerializer([], many=True).data},
                            status=status.HTTP_200_OK)
            
        return Response(data=RoomSerializer(user.rooms, many=True).data,
                        status=status.HTTP_200_OK)
        
    @require_auth(scopes=None)
    def post(self, request):
        user = get_user_from_request(request)
        data = request.data
        data["user"] = user.id
        room = RoomCreateUpdateSerializer(data=data)
        
        if not room.is_valid(raise_exception=True):
            return Response(data=room.errors,
                            status=status.HTTP_400_BAD_REQUEST)
        
        room_instance = room.save()
        return Response(data=RoomSerializer(room_instance).data,
                        status=status.HTTP_201_CREATED)

ROOM_NOT_FOUND = "Room not found"

class RoomView(GenericAPIView):
    @require_auth(scopes=None)
    def get(self, request, room_id):
        user = get_user_from_request(request)
        room = Room.objects.filter(id=room_id, user=user).first()
        if not room:
            return Response(data={"details": ROOM_NOT_FOUND},
                            status=status.HTTP_404_NOT_FOUND)
        
        return Response(data=RoomSerializer(room).data,
                        status=status.HTTP_200_OK)
    @require_auth(scopes=None)    
    def put(self, request, room_id):
        user = get_user_from_request(request)
        room = Room.objects.filter(id=room_id, user=user).first()
        if not room:
            return Response(data={"details": ROOM_NOT_FOUND},
                            status=status.HTTP_404_NOT_FOUND)
        data = request.data
        data["user"] = user.id
        room_serializer = RoomCreateUpdateSerializer(room, data=data)
        if not room_serializer.is_valid(raise_exception=True):
            return Response(data=room_serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)
        room_serializer.save()
        return Response(data=RoomSerializer(room_serializer.instance).data,
                        status=status.HTTP_200_OK)
        
        
    @require_auth(scopes=None)
    def delete(self, request, room_id):
        user = get_user_from_request(request)
        room = Room.objects.filter(id=room_id, user=user).first()
        if not room:
            return Response(data={"details": ROOM_NOT_FOUND},
                            status=status.HTTP_404_NOT_FOUND)
        room.delete()
        return Response(data={"details": "Room deleted"},
                        status=status.HTTP_204_NO_CONTENT)
    

class ExpoPushTest(GenericAPIView):
    @require_auth(scopes=None)
    def post(self, request):
        #data = request.data

        HARDCODED_PUSH_TOKEN = "ExponentPushToken[5Pf4T8A0Dn6wuJm7Zu4ZCO]"
        HARDCODED_DATA = "Hello from Thingsboard"
        expo_push_helpers.send_push_message(HARDCODED_PUSH_TOKEN, HARDCODED_DATA)
        
        return Response(status=status.HTTP_200_OK)