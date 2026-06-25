import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/orders';

export default function OrderBook({ snapshot }) {
  const { bids, asks } = snapshot;

  const handleExecute = async (orderId) => {
    try {
      const res = await axios.post(`${BASE_URL}/${orderId}/execute`);
      if (!res.data.trade) alert('❌ No matching sell order found');
    } catch (err) {
      alert(`❌ ${err.response?.data?.error || 'Error'}`);
    }
  };

  return (
    <div className="orderbook-panel">
      <div className="orderbook-header">
        <span>Price (USD)</span>
        <span>Qty (BTC)</span>
        <span>Orders</span>
        <span>Action</span>
      </div>

      <div className="orderbook-body">
        {/* ASKS */}
        {asks.length === 0 ? (
          <div className="empty-state">No sell orders</div>
        ) : (
          [...asks].reverse().map((level) => (
            <div key={level.price} className="ob-row ask">
              <span>${level.price.toLocaleString()}</span>
              <span>{level.orders.reduce((s, o) => s + o.quantity, 0)}</span>
              <span>{level.orders.length}</span>
              <span>—</span>
            </div>
          ))
        )}

        <div className="ob-divider">── SPREAD ──</div>

        {/* BIDS */}
        {bids.length === 0 ? (
          <div className="empty-state">No buy orders</div>
        ) : (
          bids.map((level) =>
            level.orders.map((order) => (
              <div key={order.id} className="ob-row bid">
                <span>${level.price.toLocaleString()}</span>
                <span>{order.quantity}</span>
                <span>{order.userId}</span>
                <button
                  className="execute-btn"
                  onClick={() => handleExecute(order.id)}
                >
                  Execute
                </button>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
}