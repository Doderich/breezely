import requests
from .. import settings
from tb_rest_client.rest_client_ce import RestClientCE, Customer
from ..api.models import User

class ThingsboardAPIHelper():
    username = settings.THINGSBOARD_USER_EMAIL
    password = settings.THINGSBOARD_USER_PASSWORD
    url = settings.THINGSBOARD_URL
    access_token = None
    
    
    def __init__(self):
        headers = {
            "content-type": "application/json"
        }
        
        json = {
            "username": self.username,
            "password": self.password
        }
        
        print(self.url + "/api/auth/login")
        
        res = requests.post(url=self.url + "/api/auth/login" , headers=headers, json=json)
        self.access_token = res.json().get("token", None)
        
    def retrieve_current_user(self):
        headers = {
            "X-Authorization": "Bearer " + self.access_token
        }
        res = requests.get(url=self.url + "/api/auth/user", headers=headers)
        
        return res.json()
         
         
class ThingsBoardClient():
    def __init__(self):
        self.client = RestClientCE(base_url=settings.THINGSBOARD_URL)
        self.client.login(settings.THINGSBOARD_USER_EMAIL, settings.THINGSBOARD_USER_PASSWORD)

    def close(self):
        self.client.logout()

    def create_user(self, user: User):
        customer = Customer(
            email=user.email,
            name=user.name,
            title=user.email
            )
        try:
            return self.client.save_customer(customer)
        except Exception as e:
            print(e)
            return None