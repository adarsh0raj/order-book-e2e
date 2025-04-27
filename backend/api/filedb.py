"""
FileDB - A simple file-based database system for the Order Book application
"""
import json
import os
from pathlib import Path
from datetime import datetime
import threading

class FileDB:
    """Simple file-based database for storing users, orders, and trades"""
    
    def __init__(self, data_dir):
        self.data_dir = Path(data_dir)
        self.users_file = self.data_dir / 'users.json'
        self.orders_file = self.data_dir / 'orders.json'
        self.trades_file = self.data_dir / 'trades.json'
        self.lock = threading.RLock()         # Thread-safe lock for file operations
        
        # Initialize data directory and files if they don't exist
        self._initialize()
    
    def _initialize(self):
        """Initialize the data directory and files"""
        # Create data directory if it doesn't exist
        if not self.data_dir.exists():
            self.data_dir.mkdir(parents=True)
        
        # Initialize users file if it doesn't exist
        if not self.users_file.exists():
            with open(self.users_file, 'w') as f:
                json.dump([], f)
        
        # Initialize orders file if it doesn't exist
        if not self.orders_file.exists():
            with open(self.orders_file, 'w') as f:
                json.dump([], f)
        
        # Initialize trades file if it doesn't exist
        if not self.trades_file.exists():
            with open(self.trades_file, 'w') as f:
                json.dump([], f)
    
    def _load_data(self, file_path):
        """Load data from a file"""
        with self.lock:
            if not file_path.exists():
                return []
            
            try:
                with open(file_path, 'r') as f:
                    return json.load(f)
            except json.JSONDecodeError:
                return []
    
    def _save_data(self, file_path, data):
        """Save data to a file"""
        with self.lock:
            with open(file_path, 'w') as f:
                json.dump(data, f, indent=2)
    
    # User management methods
    def get_users(self):
        """Get all users"""
        return self._load_data(self.users_file)
    
    def get_user(self, username):
        """Get a user by username"""
        users = self.get_users()
        for user in users:
            if user['username'] == username:
                return user
        return None
    
    def create_user(self, username, hashed_password):
        """Create a new user"""
        users = self.get_users()
        
        # Check if user already exists
        if any(user['username'] == username for user in users):
            return False
        
        new_user = {
            'id': len(users) + 1,
            'username': username,
            'password': hashed_password  # Storing hashed password
        }
        
        users.append(new_user)
        self._save_data(self.users_file, users)
        return new_user
    
    # Order management methods
    def get_orders(self):
        """Get all orders"""
        return self._load_data(self.orders_file)
    
    def get_active_orders(self):
        """Get active orders"""
        orders = self.get_orders()
        return [order for order in orders if order['is_active']]
    
    def get_user_orders(self, user_id):
        """Get orders for a specific user"""
        orders = self.get_orders()
        return [order for order in orders if order['user_id'] == user_id]
    
    def create_order(self, user_id, username, price, quantity, order_type):
        """Create a new order"""
        orders = self.get_orders()
        
        # Create new order
        new_order = {
            'id': len(orders) + 1,
            'user_id': user_id,
            'user': username,
            'price': float(price),
            'quantity': int(quantity),
            'order_type': order_type,
            'timestamp': datetime.now().isoformat(),
            'is_active': True
        }
        
        orders.append(new_order)
        self._save_data(self.orders_file, orders)
        return new_order
    
    def update_order(self, order_id, **kwargs):
        """Update an order"""
        orders = self.get_orders()
        
        for i, order in enumerate(orders):
            if order['id'] == order_id:
                orders[i].update(kwargs)
                self._save_data(self.orders_file, orders)
                return orders[i]
        
        return None
    
    # Trade management methods
    def get_trades(self):
        """Get all trades"""
        return self._load_data(self.trades_file)
    
    def create_trade(self, price, quantity, bid_user_id, bid_username, ask_user_id, ask_username):
        """Create a new trade"""
        trades = self.get_trades()
        
        # Create new trade
        new_trade = {
            'id': len(trades) + 1,
            'price': float(price),
            'quantity': int(quantity),
            'timestamp': datetime.now().isoformat(),
            'bid_user_id': bid_user_id,
            'bid_user': bid_username,
            'ask_user_id': ask_user_id,
            'ask_user': ask_username
        }
        
        trades.append(new_trade)
        self._save_data(self.trades_file, trades)
        return new_trade
    
    def get_order_book(self):
        """Get the current order book (bids and asks)"""
        active_orders = self.get_active_orders()
        
        # Separate bids and asks
        bids = [order for order in active_orders if order['order_type'] == 'bid']
        asks = [order for order in active_orders if order['order_type'] == 'ask']
        
        # Sort bids in descending order by price
        bids.sort(key=lambda x: x['price'], reverse=True)
        
        # Sort asks in ascending order by price
        asks.sort(key=lambda x: x['price'])
        
        return {'bids': bids, 'asks': asks}
    
    def match_orders(self, new_order):
        """
        Match orders based on price and quantity.
        Returns a list of executed trades.
        """
        order_book = self.get_order_book()
        executed_trades = []
        
        if new_order['order_type'] == 'bid':
            # For a bid, find matching asks (lower or equal price)
            matching_orders = [
                ask for ask in order_book['asks'] 
                if ask['price'] <= new_order['price'] and ask['user_id'] != new_order['user_id']
            ]
            
            # Sort matching asks by price (ascending)
            matching_orders.sort(key=lambda x: x['price'])
        else:
            # For an ask, find matching bids (higher or equal price)
            matching_orders = [
                bid for bid in order_book['bids'] 
                if bid['price'] >= new_order['price'] and bid['user_id'] != new_order['user_id']
            ]
            
            # Sort matching bids by price (descending)
            matching_orders.sort(key=lambda x: x['price'], reverse=True)
        
        remaining_quantity = new_order['quantity']
        
        for match in matching_orders:
            if remaining_quantity <= 0:
                break
            
            # Determine trade quantity
            trade_quantity = min(remaining_quantity, match['quantity'])
            
            # Create trade
            if new_order['order_type'] == 'bid':
                trade = self.create_trade(
                    match['price'], trade_quantity,
                    new_order['user_id'], new_order['user'],
                    match['user_id'], match['user']
                )
            else:
                trade = self.create_trade(
                    match['price'], trade_quantity,
                    match['user_id'], match['user'],
                    new_order['user_id'], new_order['user']
                )
            
            executed_trades.append(trade)
            
            # Update matched order
            if trade_quantity == match['quantity']:
                self.update_order(match['id'], is_active=False)
            else:
                self.update_order(match['id'], quantity=match['quantity'] - trade_quantity)
            
            # Update remaining quantity
            remaining_quantity -= trade_quantity
        
        # Update the new order if partially or fully filled
        if remaining_quantity <= 0:
            self.update_order(new_order['id'], is_active=False)
        elif remaining_quantity < new_order['quantity']:
            self.update_order(new_order['id'], quantity=remaining_quantity)
        
        return executed_trades
