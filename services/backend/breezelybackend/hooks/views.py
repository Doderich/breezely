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
import logging


require_auth = CustomResourceProtector()
require_auth.register_token_validator(validator.ZitadelIntrospectTokenValidator())
logger = logging.getLogger(__name__)


class ZitadelWebhookView(GenericAPIView):
    def post(self, request):
        logger.info("Received webhook request with data: %s", request.data)

        try:
            # Extract user data
            user_data = zitadel_helpers.extract_user_data(request.data)
            user_email = user_data.get("email", None)
            first_name = user_data.get("first_name", None)
            last_name = user_data.get("last_name", None)
            logger.debug("Extracted user data - Email: %s, First Name: %s, Last Name: %s", user_email, first_name, last_name)

            if not user_email:
                logger.warning("No email found in user data")
                return Response({"error": "Email not provided"}, status=status.HTTP_400_BAD_REQUEST)

            # Query existing user in Zitadel
            res = zitadel_helpers.query_user_by_email(user_email)
            if not res:
                logger.warning("User with email %s not found in Zitadel", user_email)
                return Response({"error": "User not found in Zitadel"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Extract user ID from Zitadel response
            user_id = zitadel_helpers.extract_user_id(res)
            logger.debug("Extracted user ID from Zitadel response: %s", user_id)

            # Create a new user in your system
            created_user = User.objects.create(
                name=f"{first_name} {last_name}",
                email=user_email,
                zitadel_id=user_id
            )
            logger.info("Created user in local database with ID: %s", created_user.id)

            thingsboard_conn = thingsboard_helpers.ThingsBoardClient()
            logger.debug("Initialized ThingsBoard client")

            thingsboard_user: Customer = thingsboard_conn.create_user(created_user)
            thingsboard_user_id = thingsboard_user.id.id
            logger.debug("Created user in ThingsBoard with ID: %s", thingsboard_user_id)

            if not thingsboard_user_id:
                logger.error("Failed to create user in ThingsBoard")
                return Response({"error": "Failed to create user in ThingsBoard"}, status=status.HTTP_400_BAD_REQUEST)

            # Associate ThingsBoard user ID with the created user
            created_user.thingsboard_id = thingsboard_user_id
            created_user.save()
            logger.info("Updated user %s with ThingsBoard ID: %s", created_user.id, thingsboard_user_id)

            return Response({"message": "User created successfully"}, status=status.HTTP_200_OK)

        except Exception as e:
            logger.exception("An error occurred while processing the webhook")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
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
    