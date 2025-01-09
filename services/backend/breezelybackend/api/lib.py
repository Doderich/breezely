from datetime import datetime
from rest_framework.response import Response
from rest_framework import status

from ..helpers import thingsboard_helpers

from .models import User


def get_user_from_request(request):
    # Get the user from the request
    zitadel_id = request.oauth_token.get("sub")
    if not zitadel_id:
        return Response(data={"details": "Invalid token"},
                        status=status.HTTP_400_BAD_REQUEST)
    user = User.objects.filter(zitadel_id=zitadel_id).first()
    if not user:
        return Response(data={"details": "User not found"},
                        status=status.HTTP_404_NOT_FOUND)
    else:
        return user
    
def merge_devices_and_telemetry(devices):
    client = thingsboard_helpers.ThingsBoardClient().client
    merged_devices = []

    for device in devices:
        try:
            deviceInfo = client.get_device_info_by_id(device_id=device.device_id)
            telemetry = client.telemetry_controller.get_latest_timeseries_using_get("DEVICE", device.device_id)
            telemetry['active'] = {
                "value": deviceInfo.active,
                "ts":datetime.now()
            }
        except Exception as e:
            print(f"Error fetching telemetry for device {device.device_id}: {e}")
            telemetry = {}  # Fallback: Empty telemetry data if fetching fails

        merged_devices.append({
            "device": device,
            "telemetry": telemetry
        })

    return merged_devices
