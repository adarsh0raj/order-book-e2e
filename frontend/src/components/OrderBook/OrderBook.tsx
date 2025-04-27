import React, { useEffect, useState } from 'react';
import { OrderBook as OrderBookType } from '../../types/types';
import { getOrderBook } from '../../services/api';
import './OrderBook.css';

const OrderBook: React.FC = () => {
  const [orderBook, setOrderBook] = useState<OrderBookType>({ bids: [], asks: [] });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [spread, setSpread] = useState<number | null>(null);

  const fetchOrderBook = async () => {
    try {
      setLoading(true);
      const data = await getOrderBook();
      setOrderBook(data);
      
      // Calculate the spread (difference between lowest ask and highest bid)
      if (data.asks.length > 0 && data.bids.length > 0) {
        const lowestAsk = Math.min(...data.asks.map(ask => ask.price));
        const highestBid = Math.max(...data.bids.map(bid => bid.price));
        setSpread(lowestAsk - highestBid);
      } else {
        setSpread(null);
      }
      
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
      {loading ? (
        <div className="text-center my-4">
          <div className="spinner-border text-primary-custom" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading order book data...</p>
        </div>
      ) : (
        <>
          {spread !== null && (
            <div className="spread-info mb-4">
              <div className="d-flex justify-content-center">
                <div className="badge bg-accent text-secondary-custom px-4 py-2">
                  <i className="bi bi-arrows-expand me-2"></i>
                  Spread: {spread.toFixed(2)} ({(spread / Math.min(...orderBook.asks.map(ask => ask.price)) * 100).toFixed(2)}%)
                </div>
              </div>
            </div>
          )}
          
          <div className="row gx-4">
            {/* Bids */}
            <div className="col-md-6">
              <div className="order-column bids-column">
                <h5 className="order-column-header">
                  <i className="bi bi-graph-up-arrow me-2"></i>Bids (Buy Orders)
                </h5>
                <div className="order-table-container">
                  <table className="table table-hover order-table">
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
                          <td colSpan={3} className="text-center py-4">
                            <i className="bi bi-inbox fs-4 d-block mb-2"></i>
                            No bids available
                          </td>
                        </tr>
                      ) : (
                        orderBook.bids
                          .sort((a, b) => b.price - a.price) // Sort bids in descending order by price
                          .map((bid, index) => (
                            <tr key={index} className="bid-row">
                              <td className="fw-semibold"><span className="text-success"><i className="bi bi-caret-up-fill me-1"></i>{bid.price.toFixed(2)}</span></td>
                              <td>{bid.quantity}</td>
                              <td className="fw-semibold">{(bid.price * bid.quantity).toFixed(2)}</td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            {/* Asks */}
            <div className="col-md-6">
              <div className="order-column asks-column">
                <h5 className="order-column-header">
                  <i className="bi bi-graph-down-arrow me-2"></i>Asks (Sell Orders)
                </h5>
                <div className="order-table-container">
                  <table className="table table-hover order-table">
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
                          <td colSpan={3} className="text-center py-4">
                            <i className="bi bi-inbox fs-4 d-block mb-2"></i>
                            No asks available
                          </td>
                        </tr>
                      ) : (
                        orderBook.asks
                          .sort((a, b) => a.price - b.price) // Sort asks in ascending order by price
                          .map((ask, index) => (
                            <tr key={index} className="ask-row">
                              <td className="fw-semibold"><span className="text-danger"><i className="bi bi-caret-down-fill me-1"></i>{ask.price.toFixed(2)}</span></td>
                              <td>{ask.quantity}</td>
                              <td className="fw-semibold">{(ask.price * ask.quantity).toFixed(2)}</td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-4">
            <button 
              className="btn btn-outline-primary"
              onClick={fetchOrderBook}
            >
              <i className="bi bi-arrow-repeat me-2"></i>Refresh Order Book
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderBook;
