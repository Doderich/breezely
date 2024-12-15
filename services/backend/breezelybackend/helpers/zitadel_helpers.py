import requests
import json
from ..settings import ZITADEL_DOMAIN, ZITADEL_SERICE_USER_TOKEN


def query_user_by_email(email):
    url = ZITADEL_DOMAIN + f"/v2/users"

    headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': f'Bearer {ZITADEL_SERICE_USER_TOKEN}'
    }
    payload = json.dumps({
    "query": {
        "offset": "0",
        "limit": 100,
        "asc": True
    },
    "sortingColumn": "USER_FIELD_NAME_UNSPECIFIED",
    "queries": [
        {
        "emailQuery": {
        "emailAddress": email,
        "method": "TEXT_QUERY_METHOD_EQUALS"
      }
        }
    ]
    })

    response = requests.request("POST", url, headers=headers, data=payload)
    if response.status_code > 200:
        return None
    
    return response.json()


def extract_user_data(data):
    """
    Extracts lastName, email, and firstName from the given JSON object.

    :param data: JSON object (as a string or dictionary)
    :return: Dictionary with lastName, email, and firstName
    """
    # Ensure the input is a dictionary (parse JSON string if necessary)
    if isinstance(data, str):
        data = json.loads(data)

    # Extracting the needed values from the 'form' or 'postForm' (prefer postForm if present)
    source = data.get("postForm", data.get("form", {}))

    last_name = source.get("lastname", [None])[0]
    email = source.get("email", [None])[0]
    first_name = source.get("firstname", [None])[0]

    # Returning the extracted data
    return {
        "last_name": last_name,
        "email": email,
        "first_name": first_name
    }


def extract_user_id(data):
    """
    Extracts userId from the given JSON object, ensuring the result key exists and contains exactly one entry.

    :param data: JSON object (as a string or dictionary)
    :return: The userId if found, or None if conditions are not met.
    """
    # Ensure the input is a dictionary (parse JSON string if necessary)
    if isinstance(data, str):
        data = json.loads(data)

    # Check if 'result' key exists and contains exactly one entry
    result = data.get("result", [])
    if len(result) != 1:
        return None

    # Extract and return the userId from the first (and only) entry in the result list
    return result[0].get("userId")