from rest_framework.generics import GenericAPIView

from ..serializers import UserSerializer

from ..api.models import User

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
        print(user_id)
        created_user = User.objects.create(name=first_name + " " + last_name, email=user_email, zitadel_id=user_id)
        user_serializer = UserSerializer(instance=created_user)
        return Response(status=status.HTTP_200_OK)
    
    def get(self, request):
        # validate user get
        user_email = "br@br.com"
        res = zitadel_helpers.query_user_by_email(user_email)
        return Response(data=res, status=status.HTTP_200_OK)
    
    
class ThingsboardWebhook(GenericAPIView):
    def post(self, request):
        print("thingsboard webhook worked")
        print("")
        print("data:", request.data)
        
        return Response(status=status.HTTP_200_OK)
    