from rest_framework import status, views
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
import hashlib
import os
from django.conf import settings

from .filedb import FileDB
from .jwt_utils import get_token_for_user, get_user_from_token

# Initialize the file database
DB_DIR = os.path.join(settings.BASE_DIR, 'data')
db = FileDB(DB_DIR)


class LoginView(views.APIView):
    """API endpoint for user login"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response({'detail': 'Username and password are required'}, 
                            status=status.HTTP_400_BAD_REQUEST)
        
        # Check if user exists
        user = db.get_user(username)
        
        if not user:
            return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Hash the provided password for comparison
        hashed_password = hashlib.sha256(password.encode()).hexdigest()
        
        # Compare the hashed passwords
        if user['password'] != hashed_password:
            return Response({'detail': 'Invalid password'}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Generate JWT token
        token = get_token_for_user(user['id'], user['username'])
        
        return Response({
            'token': token,
            'user': {
                'id': user['id'],
                'username': user['username']
            }
        })


class RegisterView(views.APIView):
    """API endpoint for user registration"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response({'detail': 'Username and password are required'}, 
                            status=status.HTTP_400_BAD_REQUEST)
        
        # Check if user already exists
        existing_user = db.get_user(username)
        if existing_user:
            return Response({'detail': 'Username already exists'}, 
                            status=status.HTTP_400_BAD_REQUEST)
        
        # Hash the password before storing it
        hashed_password = hashlib.sha256(password.encode()).hexdigest()
        
        # Create a new user with the hashed password
        user = db.create_user(username, hashed_password)
        
        if user:
            # Generate JWT token
            token = get_token_for_user(user['id'], user['username'])
            
            return Response({
                'token': token,
                'user': {
                    'id': user['id'],
                    'username': user['username']
                }
            }, status=status.HTTP_201_CREATED)
        
        return Response({'detail': 'Failed to create user'}, 
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class OrderBookView(views.APIView):
    """API endpoint for the order book"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        order_book = db.get_order_book()
        return Response(order_book)


class OrderView(views.APIView):
    """API endpoint for creating and listing orders"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        orders = db.get_user_orders(request.user.id)
        return Response(orders)
    
    def post(self, request):
        price = request.data.get('price')
        quantity = request.data.get('quantity')
        order_type = request.data.get('order_type')  # 'bid' or 'ask'
        
        # Validate input
        if not price or not quantity or not order_type:
            return Response({'detail': 'Price, quantity and order type are required'}, 
                            status=status.HTTP_400_BAD_REQUEST)
        
        # Validate price and quantity are positive
        try:
            price = float(price)
            quantity = int(quantity)
            
            if price <= 0 or quantity <= 0:
                return Response({'detail': 'Price and quantity must be positive'}, 
                                status=status.HTTP_400_BAD_REQUEST)
            
            if order_type not in ['bid', 'ask']:
                return Response({'detail': 'Order type must be "bid" or "ask"'}, 
                                status=status.HTTP_400_BAD_REQUEST)
        except ValueError:
            return Response({'detail': 'Invalid price or quantity format'}, 
                            status=status.HTTP_400_BAD_REQUEST)
        
        # Create the order
        new_order = db.create_order(
            user_id=request.user.id, 
            username=request.user.username, 
            price=price, 
            quantity=quantity, 
            order_type=order_type
        )
        
        # Match the order with existing orders
        trades = db.match_orders(new_order)
        
        # Return the created order and any executed trades
        return Response({
            'order': new_order,
            'trades': trades
        }, status=status.HTTP_201_CREATED)


class TradeView(views.APIView):
    """API endpoint for listing trades"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        trades = db.get_trades()
        return Response(trades)
