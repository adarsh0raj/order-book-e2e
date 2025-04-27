import React, { useEffect, useState } from 'react';
import { Order } from '../../types/types';
import { getUserOrders } from '../../services/api';
import './MyOrders.css';

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      const data = await getUserOrders();
      setOrders(data);
      setError(null);
    } catch (err) {
      setError('Failed to load your orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserOrders();
    
    // Refresh user orders every 10 seconds
    const intervalId = setInterval(fetchUserOrders, 10000);
    
    return () => clearInterval(intervalId);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading && !orders.length) {
    return <div className="text-center my-3">Loading your orders...</div>;
  }
  return (
    <div className="my-orders">
      
      {error && (
        <div className="alert alert-danger d-flex align-items-center">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <span>{error}</span>
        </div>
      )}
      
      {loading && !orders.length ? (
        <div className="text-center my-4 py-4">
          <div className="spinner-border text-primary-custom" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-state text-center py-4">
          <i className="bi bi-inbox fs-1 text-secondary-custom"></i>
          <p className="mt-2 text-muted">You don't have any orders yet</p>
        </div>
      ) : (
        <div className="orders-table-container">
          <div className="orders-header mb-4 d-flex justify-content-between align-items-center">
            <div className="orders-stats">
              <span className="badge bg-light text-primary-custom me-2">
                <i className="bi bi-list-ul me-1"></i>
                Total: {orders.length} orders
              </span>
              <span className="badge bg-light text-success me-2">
                <i className="bi bi-graph-up me-1"></i>
                Buy: {orders.filter(o => o.order_type === 'bid').length}
              </span>
              <span className="badge bg-light text-danger">
                <i className="bi bi-graph-down me-1"></i>
                Sell: {orders.filter(o => o.order_type === 'ask').length}
              </span>
            </div>
            <div className="orders-actions">
              <button 
                className="btn btn-sm btn-outline-primary"
                onClick={fetchUserOrders}
                title="Refresh Orders"
              >
                <i className="bi bi-arrow-repeat me-1"></i> Refresh
              </button>
            </div>
          </div>
          
          <div className="table-responsive orders-table">
            <table className="table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {orders
                  .sort((a, b) => 
                    a.timestamp && b.timestamp 
                      ? new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                      : 0
                  ) // Sort by timestamp (newest first)
                  .map((order, index) => (
                    <tr key={index} className={order.order_type === 'bid' ? 'bid-row' : 'ask-row'}>
                      <td>
                        <span className={`order-type-badge ${order.order_type === 'bid' ? 'buy' : 'sell'}`}>
                          {order.order_type === 'bid' ? 
                            <><i className="bi bi-caret-up-fill me-1"></i>BUY</> : 
                            <><i className="bi bi-caret-down-fill me-1"></i>SELL</>
                          }
                        </span>
                      </td>
                      <td className="fw-semibold">₹{order.price.toFixed(2)}</td>
                      <td>{order.quantity}</td>
                      <td className="fw-semibold">₹{(order.price * order.quantity).toFixed(2)}</td>
                      <td>
                        {order.hasOwnProperty('is_active') ? 
                          (order.is_active ? 
                            <span className="status-badge active">
                              <i className="bi bi-circle-fill me-1"></i>Active
                            </span> : 
                            <span className="status-badge completed">
                              <i className="bi bi-check-circle-fill me-1"></i>Completed
                            </span>
                          ) : 
                          <span className="status-badge active">
                            <i className="bi bi-circle-fill me-1"></i>Active
                          </span>
                        }
                      </td>
                      <td className="text-muted">
                        <i className="bi bi-clock me-1"></i>
                        {order.timestamp ? formatDate(order.timestamp) : 'N/A'}
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

export default MyOrders;
