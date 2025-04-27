import React, { useEffect, useState } from 'react';
import { Trade } from '../../types/types';
import { getTrades } from '../../services/api';
import './TradeHistory.css';

const TradeHistory: React.FC = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrades = async () => {
    try {
      setLoading(true);
      const data = await getTrades();
      setTrades(data);
      setError(null);
    } catch (err) {
      setError('Failed to load trade history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
    
    // Refresh trade history every 10 seconds
    const intervalId = setInterval(fetchTrades, 10000);
    
    return () => clearInterval(intervalId);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading && !trades.length) {
    return <div className="text-center my-3">Loading trade history...</div>;
  }
  return (
    <div className="trade-history">
      
      {error && (
        <div className="alert alert-danger d-flex align-items-center">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <span>{error}</span>
        </div>
      )}
      
      {loading && !trades.length ? (
        <div className="text-center my-4 py-4">
          <div className="spinner-border text-primary-custom" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading trade history...</p>
        </div>
      ) : trades.length === 0 ? (
        <div className="empty-state text-center py-4">
          <i className="bi bi-bar-chart fs-1 text-secondary-custom"></i>
          <p className="mt-3 text-muted">No trades have been executed yet</p>
          <p className="text-muted small">Completed trades will appear here</p>
        </div>
      ) : (
        <div className="trades-container">
          <div className="trades-header mb-4 d-flex justify-content-between align-items-center">
            <div className="trades-stats">
              <span className="badge bg-accent text-secondary-custom me-2 px-3 py-2">
                <i className="bi bi-activity me-1"></i>
                Total Trades: {trades.length}
              </span>
              <span className="badge bg-light text-primary-custom me-2 px-3 py-2">
                <i className="bi bi-cash-coin me-1"></i>
                Volume: ₹{trades.reduce((sum, trade) => sum + (trade.price * trade.quantity), 0).toFixed(2)}
              </span>
            </div>
            <div className="trades-actions">
              <button 
                className="btn btn-sm btn-outline-primary"
                onClick={fetchTrades}
                title="Refresh Trade History"
              >
                <i className="bi bi-arrow-repeat me-1"></i> Refresh
              </button>
            </div>
          </div>
          
          <div className="table-responsive trades-table">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total Value</th>
                  <th>Buyer</th>
                  <th>Seller</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {trades
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) // Sort by timestamp (newest first)
                  .map((trade, index) => (
                    <tr key={index} className="trade-row">
                      <td className="fw-semibold">₹{trade.price.toFixed(2)}</td>
                      <td>{trade.quantity}</td>
                      <td className="fw-semibold">₹{(trade.price * trade.quantity).toFixed(2)}</td>
                      <td>
                        <span className="user-badge buyer">
                          <i className="bi bi-person-fill me-1"></i>
                          {trade.bid_user}
                        </span>
                      </td>
                      <td>
                        <span className="user-badge seller">
                          <i className="bi bi-person-fill me-1"></i>
                          {trade.ask_user}
                        </span>
                      </td>
                      <td className="text-muted">
                        <i className="bi bi-calendar-event me-1"></i>
                        {formatDate(trade.timestamp)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradeHistory;
