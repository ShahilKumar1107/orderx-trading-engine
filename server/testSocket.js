const { io } = require('socket.io-client');

const socket = io('http://localhost:5000');

socket.on('connect', () => {
  console.log('✅ Connected to server:', socket.id);
});

// Listen for snapshot on connect
socket.on('snapshot', (data) => {
  console.log('📸 Snapshot received:', JSON.stringify(data, null, 2));
});

// Listen for new orders
socket.on('orderPlaced', (data) => {
  console.log('🟢 New order placed:', data.order);
});

// Listen for trades
socket.on('tradeExecuted', (data) => {
  console.log('⚡ Trade executed:', data.trade);
});

// Listen for cancellations
socket.on('orderCancelled', (data) => {
  console.log('🔴 Order cancelled:', data.orderId);
});