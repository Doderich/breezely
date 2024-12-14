from rest_framework import serializers

from .api.models import User



class UserCreationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("name", "email", "zitadel_id")