# Order Book Web Application

A simple yet powerful order book application for trading, built with a React frontend and Django backend.

## Project Structure

- **Frontend**: React with TypeScript in the `/frontend` directory
- **Backend**: Django REST API in the `/backend` directory
- **Database**: File-based storage system in the `/backend/data` directory

## Setup Instructions

### Backend Setup

1. Ensure you have Python 3.8+ installed
2. Navigate to the backend directory:
   ```
   cd backend
   ```
3. Create a virtual environment:
   ```
   python -m venv venv
   ```
4. Activate the virtual environment:
   - Windows: 
     ```
     .\venv\Scripts\activate
     ```
   - macOS/Linux: 
     ```
     source venv/bin/activate
     ```
5. Install required packages:
   ```
   pip install -r requirements.txt
   ```
6. Run the Django development server:
   ```
   python manage.py runserver
   ```
   The backend API will be available at `http://localhost:8000/api/`

### Frontend Setup

1. Ensure you have Node.js 16+ and npm installed
2. Navigate to the frontend directory:
   ```
   cd frontend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm run start
   ```
   The frontend application will be available at `http://localhost:3000/`

## API Endpoints

- **Authentication**:
  - POST `/api/auth/register/`: Register a new user and response will contain token and new user id and username
  - POST `/api/auth/login/`: Login and receive JWT token and user id and username

- **Order Book**:
  - GET `/api/orderbook/`: Get the current order book, all asks and all bids
  - GET `/api/orders/`: Get user's orders
  - POST `/api/orders/`: Place a new order - bid or ask both supported in payload

- **Trades**:
  - GET `/api/trades/`: Get trade history by all users

## Features

- User authentication with JWT tokens
- Real-time order book display
- Order placement (buy/sell)
- Order matching engine
- Trade history tracking
- User order history

## Assumptions and Limitations

1. **File-based Database**: Instead of using a traditional database, this application uses a custom file-based storage system (`filedb.py`) that writes to JSON files in the `/backend/data` directory. This approach is for demonstration purposes and would not be suitable for production environments with high transaction volumes.

2. **Single Token Authentication**: The application uses a simple JWT token-based authentication system. There's no token refresh mechanism, and tokens expire after a fixed period (24 hours).

3. **Single Trading Pair**: The application currently only supports trading a single asset (referred to as "RELIANCE" in the UI).

4. **In-Memory Order Matching**: Order matching occurs in memory when orders are placed.

5. **No WebSockets**: The application relies on regular polling rather than real-time WebSocket connections for updates.

## Approach and Thought Process

### Backend Architecture

1. **File-based Database**: Rather than using a traditional database, I implemented a custom file-based storage system (`FileDB` class) that reads and writes to JSON files. This simplified the setup while maintaining data persistence, and also this allowed to demostrate the full capabilities of the app without any external database connection or setup.

2. **JWT Authentication**: I chose JWT for authentication because it's stateless and provides a good balance of security and simplicity. The token contains the user ID and username, allowing the system to identify users without additional database lookups.

3. **Order Matching Engine**: The order matching engine is implemented in `filedb.py`. When a new order is placed:
   - It first checks for matching orders in the opposite order book (bids for asks, asks for bids)
   - Orders are matched based on price-time priority
   - Partial fills are supported, leaving the remainder of an order active
   - Trades are recorded when orders match

4. **REST API Design**: The API is designed to be RESTful and follows standard conventions for resource manipulation.

### Frontend Architecture

1. **Component Structure**: The frontend is built with React components that match the primary functionality:
   - Auth: Handles user registration and login
   - Dashboard: Main container for the application
   - OrderBook: Displays current buy and sell orders
   - OrderForm: Allows users to place new orders
   - MyOrders: Shows the user's active and completed orders
   - TradeHistory: Displays all executed trades

2. **State Management**: Each component manages its own state, with periodic refreshes to keep data updated.

3. **API Integration**: The application uses Axios for API requests, with a centralized API service that handles authentication token management.

4. **UI/UX Considerations**: The UI is designed to be intuitive with clear color coding (green for buys, red for sells) and responsive layouts that work on various screen sizes.