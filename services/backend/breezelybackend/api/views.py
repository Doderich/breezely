from django.http import JsonResponse
import json
import cryptography.fernet as fernet
from rest_framework.generics import GenericAPIView

from ..serializers import UserCreationSerializer


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
        return JsonResponse(dict(message={
            "userName": token.get('username', None),
            "fullName": token.get('given_name', None) + " " + token.get("family_name", None),
            "picture": token.get("picture", None),
            "id": token.get("sub", None)
        }))

class PushTokenView(GenericAPIView):
    @require_auth(scopes=None)
    def post(self, request):
        print(request.data)
        return Response(data=request.data,
                            status=status.HTTP_200_OK)