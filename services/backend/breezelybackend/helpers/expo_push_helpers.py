

from exponent_server_sdk import (
    DeviceNotRegisteredError,
    PushClient,
    PushMessage,
    PushServerError,
    PushTicketError,
)
import os
import requests
from requests.exceptions import ConnectionError, HTTPError
import logging

NOTFICATION_TITLE_MESSAGES = {
    "windowOpen": "Breezely detected an open Window!",
}


def get_message_from_notification_type(notification_type, notification_details):
    if notification_type == "default":
        return "There are updates from Breezely!"
    elif notification_type == "windowOpen":
        room_name = notification_details.get("room_name")
        device_name = notification_details.get("device_name")
        if not room_name:
            return f"{device_name} is open!"
        return f"{device_name} in {room_name} is open!"

    ## add thingsboard alalrm types and handle the notification body



session = requests.Session()
session.headers.update(
    {
        "Authorization": f"Bearer {os.getenv('EXPO_TOKEN')}",
        "accept": "application/json",
        "accept-encoding": "gzip, deflate",
        "content-type": "application/json",
    }
)

# Basic arguments. You should extend this function with the push features you
# want to use, or simply pass in a `PushMessage` object.
def send_push_message(token, notification_type, notification_details, extra=None):

    body = get_message_from_notification_type(notification_type, notification_details)
    title = NOTFICATION_TITLE_MESSAGES.get(notification_type, "Breezely")

    try:
        response = PushClient(session=session).publish(
            PushMessage(to=token,
                        title=title,
                        body=body,
                        data=extra))
    except PushServerError as exc:
        # Encountered some likely formatting/validation error.
        logging.error(f"PushServerError: {exc.errors}")
    except (ConnectionError, HTTPError) as exc:
        # Encountered some Connection or HTTP error - retry a few times in
        # case it is transient.
        logging.error(f"ConnectionError: {exc}")

    try:
        # We got a response back, but we don't know whether it's an error yet.
        # This call raises errors so we can handle them with normal exception
        # flows.
        response.validate_response()
    except DeviceNotRegisteredError:
        # This error means the user has disabled notifications for the app. In
        # a real app, we could re-enable registration here.
        logging.error(f"DeviceNotRegisteredError: {response.push_response._asdict()}")
    except PushTicketError as exc:
        # Encountered some other per-notification error.
        logging.error(f"PushTicketError: {exc.errors}")