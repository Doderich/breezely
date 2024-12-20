from django.urls import path

from .views import DeviceView, DevicesView, PushTokenView, RoomView, RoomsView, ThingboardAPIView, ThingsBoardClientView, UserInfoView

urlpatterns = [
    path('http-api', ThingboardAPIView.as_view()),
    path('rest-client', ThingsBoardClientView.as_view()),
    path('me', UserInfoView.as_view()),
    path('pushtoken', PushTokenView.as_view()),
    path('devices', DevicesView.as_view()),
    path('devices/<str:device_id>', DeviceView.as_view()),
    path('rooms', RoomsView.as_view()),
    path('rooms/<str:room_id>', RoomView.as_view()),
]