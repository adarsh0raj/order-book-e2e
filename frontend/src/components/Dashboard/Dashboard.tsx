import React from 'react';
import OrderBook from '../OrderBook/OrderBook';
import OrderForm from '../OrderForm/OrderForm';
import TradeHistory from '../TradeHistory/TradeHistory';
import MyOrders from '../MyOrders/MyOrders';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header mb-4">
          <h2 className="text-primary-custom mb-1">
            <i className="bi bi-graph-up me-2"></i>Trading Dashboard
          </h2>
          <p className="text-secondary-custom">Market overview and trading tools</p>
        </div>
        
        <div className="row">
          {/* Order Book */}
          <div className="col-lg-8">
            <div className="card mb-4">
              <div className="card-header">
                <i className="bi bi-book me-2"></i>Order Book
              </div>
              <div className="card-body">
                <OrderBook />
              </div>
            </div>
          </div>
          
          {/* Order Form */}
          <div className="col-lg-4">
            <div className="card mb-4">
              <div className="card-header">
                <i className="bi bi-file-earmark-plus me-2"></i>New Order
              </div>
              <div className="card-body">
                <OrderForm />
              </div>
            </div>
          </div>
        </div>
        
        {/* My Orders */}
        <div className="row" id="myorders">
          <div className="col-12">
            <div className="card mb-4">
              <div className="card-header">
                <i className="bi bi-list-check me-2"></i>My Orders
              </div>
              <div className="card-body">
                <MyOrders />
              </div>
            </div>
          </div>
        </div>
        
        {/* Trade History */}
        <div className="row" id="trades">
          <div className="col-12">
            <div className="card mb-4">
              <div className="card-header">
                <i className="bi bi-clock-history me-2"></i>Trade History
              </div>
              <div className="card-body">
                <TradeHistory />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
