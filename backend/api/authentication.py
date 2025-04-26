from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings
from .jwt_utils import get_user_from_token

class JWTAuthentication(BaseAuthentication):
    """
    Custom JWT authentication for DRF
    """
    def authenticate(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        
        if not auth_header.startswith('Bearer '):
            return None
        
        token = auth_header[7:]
        user_data = get_user_from_token(token)
        
        if not user_data:
            raise AuthenticationFailed('Invalid token or token expired')
        
        # Create a simple user object with the necessary methods
        user = type('User', (object,), {
            'id': user_data['id'], 
            'username': user_data['username'],
            'is_authenticated': True,
            'is_anonymous': False
        })
        
        return (user, token)
