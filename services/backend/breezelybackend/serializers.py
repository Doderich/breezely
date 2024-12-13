from rest_framework import serializers

from services.backend.breezelybackend.models import User


class UserCreationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("name", "email", "zitadel_id")