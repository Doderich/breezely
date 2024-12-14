from django.urls import path

from .views import ThingboardAPIView, ThingsBoardClientView

urlpatterns = [
    path('http-api', ThingboardAPIView.as_view()),
    path('rest-client', ThingsBoardClientView.as_view()),
]