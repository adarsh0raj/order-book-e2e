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
      
      {error && (
        <div className="alert alert-danger d-flex align-items-center">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <span>{error}</span>
        </div>
      )}
      
      {success && (
        <div className="alert alert-success d-flex align-items-center">
          <i className="bi bi-check-circle-fill me-2"></i>
          <span>{success}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="order-form">
        <div className="token-selector mb-4">
          <div className="d-flex align-items-center">
            <div className="token-icon">
              <i className="bi bi-currency-exchange"></i>
            </div>
            <div className="token-info">
              <h5 className="mb-0">RELIANCE</h5>
              <small className="text-secondary-custom">Reliance Industries</small>
            </div>
          </div>
        </div>
        
        <div className="order-type-selector mb-4">
          <label className="form-label fw-semibold mb-2">Order Type</label>
          <div className="d-flex order-type-buttons">
            <button 
              type="button"
              className={`order-type-btn ${orderType === 'bid' ? 'active buy' : ''}`}
              onClick={() => setOrderType('bid')}
            >
              <i className="bi bi-graph-up-arrow me-2"></i>
              Buy (Bid)
            </button>
            <button 
              type="button"
              className={`order-type-btn ${orderType === 'ask' ? 'active sell' : ''}`}
              onClick={() => setOrderType('ask')}
            >
              <i className="bi bi-graph-down-arrow me-2"></i>
              Sell (Ask)
            </button>
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="price" className="form-label fw-semibold">Price</label>
          <div className="input-group">
            <span className="input-group-text">₹</span>
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
          <small className="form-text text-muted">
            Enter the price per unit
          </small>
        </div>
        
        <div className="mb-4">
          <label htmlFor="quantity" className="form-label fw-semibold">Quantity</label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-hash"></i>
            </span>
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
          <small className="form-text text-muted">
            Number of units to {orderType === 'bid' ? 'buy' : 'sell'}
          </small>
        </div>
        
        <div className="total-section p-3 mb-4">
          <div className="d-flex justify-content-between">
            <span>Total Value:</span>
            <span className="fw-bold">
              {price && quantity ? `₹${(parseFloat(price) * parseFloat(quantity)).toFixed(2)}` : '₹0.00'}
            </span>
          </div>
        </div>
        
        <button 
          type="submit" 
          className={`btn ${orderType === 'bid' ? 'btn-buy' : 'btn-sell'} w-100 py-3`}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <i className={`bi ${orderType === 'bid' ? 'bi-cart-plus' : 'bi-cart-dash'} me-2`}></i>
              <span>{`Place ${orderType === 'bid' ? 'Buy' : 'Sell'} Order`}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default OrderForm;
