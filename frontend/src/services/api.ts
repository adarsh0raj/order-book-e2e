import axios from 'axios';
import { Order, Trade, AuthResponse, OrderBook } from '../types/types';

export const API_URL = 'http://localhost:8000/api';

const setAuthToken = (token: string) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Get token from localStorage if it exists
const token = localStorage.getItem('token');

if (token) {
  setAuthToken(token);
}

// Login Service - API Call
export const login = async (username: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_URL}/auth/login/`, { username, password });
    const { token, user } = response.data;
    
    // Save token to localStorage
    localStorage.setItem('token', token);
    setAuthToken(token);
    
    return { token, user };
  } catch (error) {
    console.error('Login error: ', error);
    throw error;
  }
};

// Registration Service - API Call
export const register = async (username: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_URL}/auth/register/`, { username, password });
    const { token, user } = response.data;
    
    if (token) {
      // Save token to localStorage
      localStorage.setItem('token', token);
      setAuthToken(token);
    }
    
    return { token, user };
  } catch (error) {
    console.error('Registration error: ', error);
    throw error;
  }
};

// Order Service - Get Entire Order Book - API Call
export const getOrderBook = async (): Promise<OrderBook> => {
  try {
    const response = await axios.get(`${API_URL}/orderbook/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order book:', error);
    throw error;
  }
};

// Order Service - Place Order - API Call
export const placeOrder = async (order: Order): Promise<Order> => {
  try {
    const response = await axios.post(`${API_URL}/orders/`, {
      price: order.price,
      quantity: order.quantity,
      order_type: order.order_type,
    });
    return response.data.order;
  } catch (error) {
    console.error('Error placing order:', error);
    throw error;
  }
};

export const getUserOrders = async (): Promise<Order[]> => {
  try {
    const response = await axios.get(`${API_URL}/orders/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

// Trade services
export const getTrades = async (): Promise<Trade[]> => {
  try {
    const response = await axios.get(`${API_URL}/trades/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching trades:', error);
    throw error;
  }
};
