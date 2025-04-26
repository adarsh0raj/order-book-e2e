from django.urls import path
from .views import (
    OrderView, OrderBookView, TradeView, 
    RegisterView, LoginView
)

urlpatterns = [
    path('orders/', OrderView.as_view(), name='orders'),
    path('orderbook/', OrderBookView.as_view(), name='orderbook'),
    path('trades/', TradeView.as_view(), name='trades'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
]
