from rest_framework.response import Response
from rest_framework import status

from ..helpers import thingsboard_helpers

from .models import User


def getUserFromRequest(request):
    # Get the user from the request
    user = User.objects.filter(zitadel_id=request.oauth_token.get("sub")).first()
    if not user:
        return Response(data={"details": "User not found"},
                        status=status.HTTP_404_NOT_FOUND)
    else:
        return user
    
def mergeDevicesAndTelemetry(devices):
    client = client = thingsboard_helpers.ThingsBoardClient().client
    merged_devices = []
    for device in devices:
        try:
            telemetry = client.telemetry_controller.get_latest_timeseries_using_get("DEVICE", device.device_id)
        except Exception as e:
            print(e)
            return Response(data={"details": "Failed to retrieve device data"},
                            status=status.HTTP_400_BAD_REQUEST)
        merged_devices.append({"device": device, "telemetry": telemetry})
    
    return merged_devices