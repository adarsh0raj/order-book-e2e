from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Order, Trade


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username')


class OrderSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    
    class Meta:
        model = Order
        fields = ('id', 'user', 'price', 'quantity', 'order_type', 'timestamp')
        read_only_fields = ('id', 'user', 'timestamp')
    
    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Price must be a positive number.")
        return value
    
    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError("Quantity must be a positive number.")
        return value


class TradeSerializer(serializers.ModelSerializer):
    bid_user = serializers.ReadOnlyField(source='bid_user.username')
    ask_user = serializers.ReadOnlyField(source='ask_user.username')
    
    class Meta:
        model = Trade
        fields = ('id', 'price', 'quantity', 'timestamp', 'bid_user', 'ask_user')
        read_only_fields = ('id', 'timestamp', 'bid_user', 'ask_user')


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    
    class Meta:
        model = User
        fields = ('username', 'password')
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user
