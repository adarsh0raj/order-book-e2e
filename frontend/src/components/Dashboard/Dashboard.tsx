import React from 'react';
import OrderBook from '../OrderBook/OrderBook';
import OrderForm from '../OrderForm/OrderForm';
import TradeHistory from '../TradeHistory/TradeHistory';
import MyOrders from '../MyOrders/MyOrders';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <div className="container-fluid">
        <div className="row">
          {/* Order Book */}
          <div className="col-md-8">
            <div className="card mb-4">
              <div className="card-body">
                <OrderBook />
              </div>
            </div>
          </div>
          
          {/* Order Form */}
          <div className="col-md-4">
            <div className="card mb-4">
              <div className="card-body">
                <OrderForm />
              </div>
            </div>
          </div>
        </div>
        
        {/* My Orders */}
        <div className="row">
          <div className="col-12">
            <div className="card mb-4">
              <div className="card-body">
                <MyOrders />
              </div>
            </div>
          </div>
        </div>
        
        {/* Trade History */}
        <div className="row">
          <div className="col-12">
            <div className="card mb-4">
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
