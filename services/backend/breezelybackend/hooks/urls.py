from django.urls import path

from .views import ThingsboardWebhook, ZitadelWebhookView


urlpatterns = [
    path('zitadel', ZitadelWebhookView.as_view()),
    path('thingsboard', ThingsboardWebhook.as_view())
]
