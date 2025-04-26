import React, { useState } from 'react';
import { placeOrder } from '../../services/api';
import './OrderForm.css';

const OrderForm: React.FC = () => {
  const [price, setPrice] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [orderType, setOrderType] = useState<'bid' | 'ask'>('bid');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!price || !quantity) {
      setError('Please fill in all fields');
      return;
    }
    
    if (parseFloat(price) <= 0 || parseFloat(quantity) <= 0) {
      setError('Price and quantity must be positive numbers');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const order = {
        price: parseFloat(price),
        quantity: parseFloat(quantity),
        order_type: orderType,
      };
      
      await placeOrder(order);
      
      setSuccess(`Successfully placed ${orderType === 'bid' ? 'buy' : 'sell'} order`);
      
      // Reset form
      setPrice('');
      setQuantity('');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
      
    } catch (err) {
      setError('Failed to place order. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="order-form-container">
      <h2 className="text-center mb-4">Place New Order</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      <form onSubmit={handleSubmit} className="order-form">
        <div className="mb-3">
          <label className="form-label">Token</label>
          <input 
            type="text" 
            className="form-control" 
            value="RELIANCE" 
            disabled 
            title="Currently only supporting RELIANCE token"
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Order Type</label>
          <div className="d-flex">
            <div className="form-check me-4">
              <input 
                className="form-check-input" 
                type="radio" 
                name="orderType" 
                id="bidOrder"
                checked={orderType === 'bid'}
                onChange={() => setOrderType('bid')}
              />
              <label className="form-check-label text-success" htmlFor="bidOrder">
                Buy (Bid)
              </label>
            </div>
            <div className="form-check">
              <input 
                className="form-check-input" 
                type="radio" 
                name="orderType" 
                id="askOrder"
                checked={orderType === 'ask'}
                onChange={() => setOrderType('ask')}
              />
              <label className="form-check-label text-danger" htmlFor="askOrder">
                Sell (Ask)
              </label>
            </div>
          </div>
        </div>
        
        <div className="mb-3">
          <label htmlFor="price" className="form-label">Price</label>
          <input 
            type="number"
            step="0.01" 
            className="form-control" 
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price"
            min="0.01"
            required
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="quantity" className="form-label">Quantity</label>
          <input 
            type="number" 
            step="1"
            className="form-control" 
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Enter quantity"
            min="1"
            required
          />
        </div>
        
        <button 
          type="submit" 
          className={`btn btn-${orderType === 'bid' ? 'success' : 'danger'} w-100`}
          disabled={loading}
        >
          {loading ? 'Placing Order...' : `Place ${orderType === 'bid' ? 'Buy' : 'Sell'} Order`}
        </button>
      </form>
    </div>
  );
};

export default OrderForm;
