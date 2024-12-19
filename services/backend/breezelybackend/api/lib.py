from rest_framework.response import Response
from rest_framework import status

from .models import User


def getUserFromRequest(request):
    # Get the user from the request
    user = User.objects.filter(zitadel_id=request.oauth_token.get("sub")).first()
    if not user:
        return Response(data={"details": "User not found"},
                        status=status.HTTP_404_NOT_FOUND)
    else:
        return user