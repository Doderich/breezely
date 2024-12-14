from rest_framework.generics import GenericAPIView

from ..helpers import thingsboard_helpers
from ..custom_resource_protector import CustomResourceProtector
from rest_framework.response import Response
from rest_framework import status
from .. import validator



require_auth = CustomResourceProtector()
require_auth.register_token_validator(validator.ZitadelIntrospectTokenValidator())

class ZitadelWebhookView(GenericAPIView):
    def post(self, request):
        print("zitadel webhook worked")
        print("")
        print("data: ", request.data)
        
        return Response(status=status.HTTP_200_OK)