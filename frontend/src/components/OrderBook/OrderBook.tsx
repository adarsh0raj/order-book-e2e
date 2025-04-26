import React, { useEffect, useState } from 'react';
import { OrderBook as OrderBookType } from '../../types/types';
import { getOrderBook } from '../../services/api';
import './OrderBook.css';

const OrderBook: React.FC = () => {
  const [orderBook, setOrderBook] = useState<OrderBookType>({ bids: [], asks: [] });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderBook = async () => {
    try {
      setLoading(true);
      const data = await getOrderBook();
      setOrderBook(data);
      setError(null);
    } catch (err) {
      setError('Failed to load order book');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderBook();
    
    // Refresh order book every 10 seconds
    const intervalId = setInterval(fetchOrderBook, 10000);
    
    return () => clearInterval(intervalId);
  }, []);

  if (loading && !orderBook.bids.length && !orderBook.asks.length) {
    return <div className="text-center my-5">Loading order book...</div>;
  }

  if (error) {
    return <div className="alert alert-danger my-3">{error}</div>;
  }

  return (
    <div className="order-book">
      <h2 className="text-center mb-4">Order Book</h2>
      <div className="row">
        <div className="col-md-6">
          <h4 className="text-success">Bids (Buy Orders)</h4>
          <table className="table table-striped table-sm">
            <thead>
              <tr>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {orderBook.bids.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center">No bids available</td>
                </tr>
              ) : (
                orderBook.bids
                  .sort((a, b) => b.price - a.price) // Sort bids in descending order by price
                  .map((bid, index) => (
                    <tr key={index} className="bid-row">
                      <td className="text-success">{bid.price.toFixed(2)}</td>
                      <td>{bid.quantity}</td>
                      <td>{(bid.price * bid.quantity).toFixed(2)}</td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
        <div className="col-md-6">
          <h4 className="text-danger">Asks (Sell Orders)</h4>
          <table className="table table-striped table-sm">
            <thead>
              <tr>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {orderBook.asks.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center">No asks available</td>
                </tr>
              ) : (
                orderBook.asks
                  .sort((a, b) => a.price - b.price) // Sort asks in ascending order by price
                  .map((ask, index) => (
                    <tr key={index} className="ask-row">
                      <td className="text-danger">{ask.price.toFixed(2)}</td>
                      <td>{ask.quantity}</td>
                      <td>{(ask.price * ask.quantity).toFixed(2)}</td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="text-center mt-3">
        <button 
          className="btn btn-outline-primary"
          onClick={fetchOrderBook}
        >
          Refresh Order Book
        </button>
      </div>
    </div>
  );
};

export default OrderBook;
