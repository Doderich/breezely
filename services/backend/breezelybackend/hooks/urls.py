from django.urls import path

from .views import ZitadelWebhookView


urlpatterns = [
    path('zitadel', ZitadelWebhookView.as_view()),
    
]
