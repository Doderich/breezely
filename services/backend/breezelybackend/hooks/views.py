from rest_framework.generics import GenericAPIView
from tb_rest_client.rest_client_ce import Customer

from ..helpers import expo_push_helpers

from ..api.models import Device, User

from ..helpers import zitadel_helpers
from ..helpers import thingsboard_helpers
from ..custom_resource_protector import CustomResourceProtector
from rest_framework.response import Response
from rest_framework import status
from .. import validator



require_auth = CustomResourceProtector()
require_auth.register_token_validator(validator.ZitadelIntrospectTokenValidator())

class ZitadelWebhookView(GenericAPIView):
    def post(self, request):
        user_data = zitadel_helpers.extract_user_data(request.data)
        user_email = user_data.get("email", None)
        first_name = user_data.get("first_name", None)
        last_name = user_data.get("last_name", None)
        
        if not user_email:
            return
        res = zitadel_helpers.query_user_by_email(user_email)
        if not res:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        user_id = zitadel_helpers.extract_user_id(res)
        created_user = User.objects.create(name=first_name + " " + last_name, email=user_email, zitadel_id=user_id)
        ## todo: create user in thingsboard
        thingsboard_conn = thingsboard_helpers.ThingsBoardClient()
        thingsboard_user: Customer = thingsboard_conn.create_user(created_user)
        thingsboard_user_id = thingsboard_user.id.id
        if not thingsboard_user_id:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        created_user.thingsboard_id = thingsboard_user_id
        created_user.save()
        return Response(status=status.HTTP_200_OK)
    
    def get(self, request):
        # validate user get
        user_email = "br@br.com"
        res = zitadel_helpers.query_user_by_email(user_email)
        return Response(data=res, status=status.HTTP_200_OK)
    
    
class ThingsboardWebhook(GenericAPIView):
    def post(self, request):
        data = request.data
        print(data)
        customer_info = data.get("customerId", None)
        if not customer_info:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        customer_id = customer_info.get("id", None)
        if not customer_id:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(thingsboard_id=customer_id).first()
        if not user:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        expo_push_token = user.expo_push_token
        details = data.get("details", None)
       
        if details:
            notification_type = details.get("type", "default")

        device_info = data.get("originator", None)
        if not device_info:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        device_id = device_info.get("id", None)
        if not device_id:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        device = Device.objects.filter(device_id=device_id).first()
        if not device:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        device_name = device.name
        room_name = device.assigned_room.name if device.assigned_room else None

        notification_details = {
            "device_name": device_name,
            "room_name": room_name,
        }


        expo_push_helpers.send_push_message(expo_push_token, notification_type, notification_details)
        
        return Response(status=status.HTTP_200_OK)
    