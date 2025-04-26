import axios from 'axios';
import { Order, Trade, AuthResponse, OrderBook } from '../types/types';

export const API_URL = 'http://localhost:8000/api';

// Function to set the JWT token in the request headers
const setAuthToken = (token: string) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Initialize token from localStorage if it exists
const token = localStorage.getItem('token');
if (token) {
  setAuthToken(token);
}

// Auth services
export const login = async (username: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_URL}/auth/login/`, { username, password });
    const { token, user } = response.data;
    
    // Save token to localStorage
    localStorage.setItem('token', token);
    setAuthToken(token);
    
    return { token, user };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const register = async (username: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_URL}/auth/register/`, { username, password });
    const { token, user } = response.data;
    
    // Save token to localStorage
    localStorage.setItem('token', token);
    setAuthToken(token);
    
    return { token, user };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Order services
export const getOrderBook = async (): Promise<OrderBook> => {
  try {
    const response = await axios.get(`${API_URL}/orderbook/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order book:', error);
    throw error;
  }
};

export const placeOrder = async (order: Order): Promise<Order> => {
  try {
    const response = await axios.post(`${API_URL}/orders/`, {
      price: order.price,
      quantity: order.quantity,
      orderType: order.orderType
    });
    return response.data.order;
  } catch (error) {
    console.error('Error placing order:', error);
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
