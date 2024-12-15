from django.urls import path

from .views import PushTokenView, ThingboardAPIView, ThingsBoardClientView, UserInfoView

urlpatterns = [
    path('http-api', ThingboardAPIView.as_view()),
    path('rest-client', ThingsBoardClientView.as_view()),
    path('me', UserInfoView.as_view()),
    path('pushtoken', PushTokenView.as_view()),
]