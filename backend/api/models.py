from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class Order(models.Model):
    ORDER_TYPES = (
        ('bid', 'Bid'),
        ('ask', 'Ask'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField()
    order_type = models.CharField(max_length=3, choices=ORDER_TYPES)
    timestamp = models.DateTimeField(default=timezone.now)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.order_type.upper()} - {self.quantity} @ {self.price} by {self.user.username}"


class Trade(models.Model):
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField()
    timestamp = models.DateTimeField(default=timezone.now)
    bid_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bid_trades')
    ask_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ask_trades')
    
    class Meta:
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"Trade - {self.quantity} @ {self.price} between {self.bid_user.username} and {self.ask_user.username}"
