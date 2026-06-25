import { useState } from 'react';
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/orders';

export default function OrderForm() {
  const [type, setType] = useState('buy');
  const [form, setForm] = useState({ price: '', quantity: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async () => {
    if (!form.price || !form.quantity) {
      setMessage('❌ Fill all fields');
      return;
    }

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    console.log('Placing order as:', user);

    try {
      const res = await axios.post(BASE_URL, {
        userId: user.name,
        type,
        price: Number(form.price),
        quantity: Number(form.quantity)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(`✅ ${type.toUpperCase()} order placed`);
      setForm({ price: '', quantity: '' });
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.error || 'Error'}`);
    }
  };

  return (
    <div className="order-form">
      <div className="tab-row">
        <button
          className={`tab-btn ${type === 'buy' ? 'active-buy' : ''}`}
          onClick={() => setType('buy')}
        >
          BUY
        </button>
        <button
          className={`tab-btn ${type === 'sell' ? 'active-sell' : ''}`}
          onClick={() => setType('sell')}
        >
          SELL
        </button>
      </div>

      

      <div className="form-row">
        <label>Price (USD)</label>
        <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="0.00" />
      </div>

      <div className="form-row">
        <label>Quantity (BTC)</label>
        <input name="quantity" type="number" value={form.quantity} onChange={handleChange} placeholder="0.00" />
      </div>

      <button
        className={`submit-btn ${type}`}
        onClick={handleSubmit}
      >
        {type === 'buy' ? '▲ Place Buy Order' : '▼ Place Sell Order'}
      </button>

      {message && <p className="form-message">{message}</p>}
    </div>
  );
}