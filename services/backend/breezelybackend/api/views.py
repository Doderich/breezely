from django.http import JsonResponse
import json
import cryptography.fernet as fernet
from django.urls import reverse
from rest_framework.generics import GenericAPIView

from .lib import getUserFromRequest

from .serializers import DeviceSerializer, UserSerializer
from .models import Device, User


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
        

class UserCreationView(GenericAPIView):
    @require_auth(scopes=None)
    def post(self, request):
        data = request.data
        user = None

        user_serializer = UserCreationSerializer(data=data)
        if user_serializer.is_valid(raise_exception=True):
            user = user_serializer.save()
        
        if not user:
            return Response(data={"details": "User creation failed due to invalid data"},
                            status=status.HTTP_400_BAD_REQUEST)

        # todo: 
        # Take email from login as thingsboard email, create a randomly generated pw and encrypt it
        # Create User in thingsboard as customer, retrieve thingsboard id
        # save newly created data in user instance


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
        return JsonResponse(dict(message={
            "userName": token.get('username', None),
            "fullName": token.get('given_name', None) + " " + token.get("family_name", None),
            "id": token.get("sub", None)
        }))

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
        client = thingsboard_helpers.ThingsBoardClient().client
        merged_devices = []
        for device in devices:
            try:
                telemetry = client.telemetry_controller.get_latest_timeseries_using_get("DEVICE", device.device_id)
            except Exception as e:
                print(e)
                return Response(data={"details": "Failed to retrieve device data"},
                                status=status.HTTP_400_BAD_REQUEST)
            merged_devices.append({"device": DeviceSerializer(device).data, "telemetry": telemetry})
        return Response(data={"devices": merged_devices},
                        status=status.HTTP_200_OK)
        
    @require_auth(scopes=None)
    def post(self, request):
        user = getUserFromRequest(request)
        client = thingsboard_helpers.ThingsBoardClient().client
        device_data = {**request.data, "user": user.id}
        device = DeviceSerializer(data=device_data)
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
        
        
class DeviceView(GenericAPIView):
    @require_auth(scopes=None)
    def get(self, request, device_id):
        user = getUserFromRequest(request)
        device = Device.objects.filter(id=device_id, user=user).first()
        if not device:
            return Response(data={"details": "Device not found"},
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
            return Response(data={"details": "Device not found"},
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
            return Response(data={"details": "Device not found"},
                            status=status.HTTP_404_NOT_FOUND)
        client = thingsboard_helpers.ThingsBoardClient().client
        try:
            client.unassign_device_from_customer(device.device_id)
        except Exception as e:
            print(e)
        device.delete()
        return Response(data={"details": "Device deleted"},
                        status=status.HTTP_200_OK)