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
      <h2 className="text-center mb-4">My Orders</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      {orders.length === 0 ? (
        <div className="text-center text-muted">You don't have any orders yet</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
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
                    <td className={order.order_type === 'bid' ? 'text-success' : 'text-danger'}>
                      {order.order_type === 'bid' ? 'BUY' : 'SELL'}
                    </td>
                    <td>{order.price.toFixed(2)}</td>
                    <td>{order.quantity}</td>
                    <td>{(order.price * order.quantity).toFixed(2)}</td>
                    <td>
                      {order.hasOwnProperty('is_active') ? 
                        (order.is_active ? 
                          <span className="badge bg-success">Active</span> : 
                          <span className="badge bg-secondary">Completed</span>
                        ) : 
                        <span className="badge bg-success">Active</span>
                      }
                    </td>
                    <td>{order.timestamp ? formatDate(order.timestamp) : 'N/A'}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="text-center mt-3">
        <button 
          className="btn btn-outline-primary"
          onClick={fetchUserOrders}
        >
          Refresh My Orders
        </button>
      </div>
    </div>
  );
};

export default MyOrders;
