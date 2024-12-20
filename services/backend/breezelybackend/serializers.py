from rest_framework import serializers

from .api.models import User



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("name", "email", "thingsboard_id", "zitadel_id", "expo_push_token")
        