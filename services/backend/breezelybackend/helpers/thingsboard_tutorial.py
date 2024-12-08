import logging
# Importing models and REST client class from Community Edition version
from tb_rest_client.rest_client_ce import *
# Importing the API exception
from tb_rest_client.rest import ApiException


logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s - %(levelname)s - %(module)s - %(lineno)d - %(message)s',
                    datefmt='%Y-%m-%d %H:%M:%S')


# ThingsBoard REST API URL
url = "http://server-malte.duckdns.org:5868"

# Default Tenant Administrator credentials
username = "tenant@thingsboard.org"
password = "tenant"


def main():
    # Creating the REST client object with context manager to get auto token refresh
    with RestClientCE(base_url=url) as rest_client:
        try:
            rest_client.login(username=username, password=password)
            # creating a Device
            default_device_profile_id = rest_client.get_default_device_profile_info().id
            device = Device(name="Thermometer 1",
                            device_profile_id=default_device_profile_id)
            device = rest_client.save_device(device)

            logging.info(" Device was created:\n%r\n", device)

            # find device by device id
            found_device = rest_client.get_device_by_id(DeviceId(device.id, 'DEVICE'))

            # save device shared attributes
            rest_client.save_device_attributes(DeviceId(device.id, 'DEVICE'), 'SERVER_SCOPE',
                                                     {'targetTemperature': 22.4})

            # Get device shared attributes
            res = rest_client.get_attributes_by_scope(EntityId(device.id, 'DEVICE'), 'SERVER_SCOPE',
                                                      'targetTemperature')
            logging.info("Found device attributes: \n%r", res)

            # delete the device
            rest_client.delete_device(DeviceId(device.id, 'DEVICE'))
        except ApiException as e:
            logging.exception(e)


if __name__ == '__main__':
    main()

