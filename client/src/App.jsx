import { useState, useEffect } from 'react';
import socket from './socket';
import Auth from './components/Auth';
import OrderForm from './components/OrderForm';
import OrderBook from './components/OrderBook';
import TradeHistory from './components/TradeHistory';
import OrderHistory from './components/OrderHistory';

export default function App() {
  const [connected, setConnected] = useState(false);
  const [snapshot, setSnapshot] = useState({ bids: [], asks: [], tradeHistory: [] });
  const [activeTab, setActiveTab] = useState('trades');

  // Check if user is already logged in
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (userData, token) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  useEffect(() => {
    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    socket.on('snapshot', (data) => setSnapshot(data));

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('snapshot');
    };
  }, []);

  // Show auth screen if not logged in
  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  const totalBids = snapshot.bids.reduce((s, l) => s + l.orders.length, 0);
  const totalAsks = snapshot.asks.reduce((s, l) => s + l.orders.length, 0);
  const totalTrades = snapshot.tradeHistory.length;

  return (
    <div>
      {/* TOP BAR */}
      <div className="topbar">
        <span className="topbar-logo">
          ⚡ OrderX <span style={{ color: '#f7931a' }}>₿</span>
        </span>

        <div className="topbar-stats">
          <div className="stat-item">
            <span className="stat-label">Buy Orders</span>
            <span className="stat-value" style={{ color: '#3fb950' }}>{totalBids}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Sell Orders</span>
            <span className="stat-value" style={{ color: '#f85149' }}>{totalAsks}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Trades</span>
            <span className="stat-value">{totalTrades}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="topbar-status">
            <span className={`status-dot ${connected ? 'connected' : 'disconnected'}`} />
            {connected ? 'Live' : 'Disconnected'}
          </div>
          <div style={{ color: '#8b949e', fontSize: '12px' }}>
            👤 {user.name}
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: 'transparent',
              border: '1px solid #30363d',
              color: '#8b949e',
              padding: '4px 10px',
              borderRadius: '4px',
              fontSize: '11px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="layout">
        <div className="left-panel">
          <div className="panel-title">Place Order — BTC/USD</div>
          <OrderForm />
        </div>

        <div className="right-panel">
          <OrderBook snapshot={snapshot} />

          <div className="bottom-panel">
            <div className="bottom-tabs">
              <div
                className={`bottom-tab ${activeTab === 'trades' ? 'active' : ''}`}
                onClick={() => setActiveTab('trades')}
              >
                Trade History
              </div>
              <div
                className={`bottom-tab ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                Open Orders
              </div>
            </div>

            {activeTab === 'trades'
              ? <TradeHistory trades={snapshot.tradeHistory} />
              : <OrderHistory snapshot={snapshot} />
            }
          </div>
        </div>
      </div>
    </div>
  );
}