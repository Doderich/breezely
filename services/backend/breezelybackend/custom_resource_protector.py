from authlib.integrations.django_oauth2 import ResourceProtector
from authlib.oauth2 import (
    OAuth2Error
)
from authlib.oauth2.rfc6749 import (
    MissingAuthorizationError,
)
import functools

from django.http import JsonResponse

from .validator import ValidatorError

class CustomResourceProtector(ResourceProtector):
    def __call__(self, scopes=None, optional=False, **kwargs):
        claims = kwargs
        claims['scopes'] = scopes  # backward compatibility

        def wrapper(f):
            @functools.wraps(f)
            def decorated(instance_or_request, *args, **kwargs):
                # Check if the first argument is `self` (for class-based views)
                request = instance_or_request.request if hasattr(instance_or_request, "request") else instance_or_request
                try:
                    token = self.acquire_token(request, **claims)
                    request.oauth_token = token
                except MissingAuthorizationError as error:
                    if optional:
                        request.oauth_token = None
                        return f(instance_or_request, *args, **kwargs)
                    return return_error_response(error)
                except OAuth2Error as error:
                    return return_error_response(error)
                except ValidatorError as error:
                    return JsonResponse(error.error, status=error.status_code)
                # Pass the instance correctly for class-based views
                return f(instance_or_request, *args, **kwargs)
            return decorated
        return wrapper


def return_error_response(error):
    # Prepare the JSON body
    body = dict(error.get_body())
    
    # Create a JsonResponse object
    resp = JsonResponse(body, status=error.status_code, safe=False)
    
    # Set headers on the response
    headers = dict(error.get_headers())
    for k, v in headers.items():
        resp[k] = v
    
    return resp