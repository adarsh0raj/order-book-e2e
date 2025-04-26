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
      <h2 className="text-center mb-4">Trade History</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      {trades.length === 0 ? (
        <div className="text-center text-muted">No trades executed yet</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {trades
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) // Sort by timestamp (newest first)
                .map((trade, index) => (
                  <tr key={index}>
                    <td>{trade.price.toFixed(2)}</td>
                    <td>{trade.quantity}</td>
                    <td>{(trade.price * trade.quantity).toFixed(2)}</td>
                    <td>{formatDate(trade.timestamp)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="text-center mt-3">
        <button 
          className="btn btn-outline-primary"
          onClick={fetchTrades}
        >
          Refresh Trade History
        </button>
      </div>
    </div>
  );
};

export default TradeHistory;
