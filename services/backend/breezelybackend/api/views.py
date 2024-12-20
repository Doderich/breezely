from django.http import JsonResponse
import json
import cryptography.fernet as fernet
from django.urls import reverse
from rest_framework.generics import GenericAPIView

from .lib import getUserFromRequest, mergeDevicesAndTelemetry

from .serializers import DeviceSerializer, MergedDevicesSerializer, RoomCreateUpdateSerializer, RoomSerializer, UserSerializer
from .models import Device, Room, User


from ..custom_resource_protector import CustomResourceProtector
from .. import validator
from ..helpers import thingsboard_helpers
from rest_framework.response import Response
from rest_framework import status

require_auth = CustomResourceProtector()
require_auth.register_token_validator(validator.ZitadelIntrospectTokenValidator())



class ThingboardAPIView(GenericAPIView):

    # @require_auth(None)
    # def private(request):
    #     """A valid access token is required to access this route
    #     """
    #     response = "Hello from a private endpoint! You need to be authenticated to see this."
    #     return JsonResponse(dict(message=response))


    # @require_auth("urn:zitadel:iam:org:project:role:read:messages")
    # def private_scoped(request):
    #     """A valid access token and an appropriate scope are required to access this route
    #     """
    #     response = "Hello from a private endpoint! You need to be authenticated and have a scope of read:messages to see this."
    #     return JsonResponse(dict(message=response))

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
        user = getUserFromRequest(request)
        devices = Device.objects.filter(user=user)
        if not devices:
            return Response(data={"devices": []},
                            status=status.HTTP_200_OK)
        merged_devices_serialized = MergedDevicesSerializer(mergeDevicesAndTelemetry(devices), many=True)
        return Response(data=merged_devices_serialized.data,
                        status=status.HTTP_200_OK)
        
    @require_auth(scopes=None)
    def post(self, request):
        user = getUserFromRequest(request)
        client = thingsboard_helpers.ThingsBoardClient().client
        data = request.data
        data["user"] = user.id
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
        user = getUserFromRequest(request)
        device = Device.objects.filter(id=device_id, user=user).first()
        if not device:
            return Response(data={"details": DEVICE_NOT_FOUND},
                            status=status.HTTP_404_NOT_FOUND)
        client = thingsboard_helpers.ThingsBoardClient().client
        try:
            telemetry = client.telemetry_controller.get_latest_timeseries_using_get("DEVICE", device.device_id)
        except Exception as e:
            print(e)
            return Response(data={"details": "Failed to retrieve telemetry data"},
                            status=status.HTTP_400_BAD_REQUEST)
        return Response(data={"device": DeviceSerializer(device).data, "telemetry": telemetry},
                        status=status.HTTP_200_OK)
    @require_auth(scopes=None)    
    def put(self, request, device_id):
        user = getUserFromRequest(request)
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
        user = getUserFromRequest(request)
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
        user = getUserFromRequest(request)
        if not user.rooms:
            return Response(data={RoomSerializer([], many=True).data},
                            status=status.HTTP_200_OK)
            
        return Response(data=RoomSerializer(user.rooms, many=True).data,
                        status=status.HTTP_200_OK)
        
    @require_auth(scopes=None)
    def post(self, request):
        user = getUserFromRequest(request)
        data = request.data
        data["user"] = user.id
        room = RoomCreateUpdateSerializer(data=data)
        
        if not room.is_valid(raise_exception=True):
            return Response(data=room.errors,
                            status=status.HTTP_400_BAD_REQUEST)
        
        room_instance = room.save()
        return Response(data=RoomSerializer(room_instance).data,
                        status=status.HTTP_201_CREATED)

class RoomView(GenericAPIView):
    @require_auth(scopes=None)
    def get(self, request, room_id):
        user = getUserFromRequest(request)
        room = Room.objects.filter(id=room_id, user=user).first()
        if not room:
            return Response(data={"details": "Room not found"},
                            status=status.HTTP_404_NOT_FOUND)
        
        return Response(data=RoomSerializer(room).data,
                        status=status.HTTP_200_OK)
    @require_auth(scopes=None)    
    def put(self, request, room_id):
        user = getUserFromRequest(request)
        room = Room.objects.filter(id=room_id, user=user).first()
        if not room:
            return Response(data={"details": "Room not found"},
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
        user = getUserFromRequest(request)
        room = Room.objects.filter(id=room_id, user=user).first()
        if not room:
            return Response(data={"details": "Room not found"},
                            status=status.HTTP_404_NOT_FOUND)
        room.delete()
        return Response(data={"details": "Room deleted"},
                        status=status.HTTP_204_NO_CONTENT)