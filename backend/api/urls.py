from django.urls import path
from . import views

urlpatterns = [
    path('orders/', views.OrderView.as_view(), name='orders'),
    path('orderbook/', views.OrderBookView.as_view(), name='orderbook'),
    path('trades/', views.TradeView.as_view(), name='trades'),
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/login/', views.LoginView.as_view(), name='login'),
]
