from django.http import JsonResponse
import json

from .custom_resource_protector import CustomResourceProtector
from . import validator
from .helpers import thingsboard_helpers
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView 

require_auth = CustomResourceProtector()
require_auth.register_token_validator(validator.ZitadelIntrospectTokenValidator())



class ThingboardAPIView(APIView):

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
        
        
class ThingsBoardClientView(APIView):
    require_auth(scopes=None)
    def get(self, request):
        
        client = thingsboard_helpers.ThingsBoardClient().client
        res = client.get_user()
        return Response(data=res.to_dict(),
                        status=status.HTTP_200_OK)
        
