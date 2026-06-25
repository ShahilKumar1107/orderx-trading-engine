const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const orderBook = require('../orderBook');
const Trade = require('../models/Trade');

// ─── GET SNAPSHOT ────────────────────────────────
router.get('/snapshot', (req, res) => {
  const snapshot = orderBook.getSnapshot();
  res.json(snapshot);
});

// ─── PLACE ORDER ─────────────────────────────────
router.post('/', (req, res) => {
  const { userId, type, price, quantity } = req.body;

  if (!userId || !type || !price || !quantity) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  if (type !== 'buy' && type !== 'sell') {
    return res.status(400).json({ error: 'type must be buy or sell' });
  }

  if (price <= 0 || quantity <= 0) {
    return res.status(400).json({ error: 'price and quantity must be positive' });
  }

  const order = {
    id: uuidv4(),
    userId,
    type,
    price: Number(price),
    quantity: Number(quantity),
    timestamp: new Date()
  };

  const placed = orderBook.placeOrder(order);

  // 🔥 Broadcast to ALL connected users
  const io = req.app.get('io');
  io.emit('orderPlaced', { order: placed });
  io.emit('snapshot', orderBook.getSnapshot());

  res.status(201).json({ message: 'Order placed', order: placed });
});

// ─── CANCEL ORDER ────────────────────────────────
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  const cancelled = orderBook.cancelOrder(id);

  if (!cancelled) {
    return res.status(404).json({ error: 'Order not found' });
  }

  // 🔥 Broadcast to ALL connected users
  const io = req.app.get('io');
  io.emit('orderCancelled', { orderId: id });
  io.emit('snapshot', orderBook.getSnapshot());

  res.json({ message: 'Order cancelled', order: cancelled });
});

// ─── EXECUTE ORDER ───────────────────────────────
// ─── EXECUTE ORDER ───────────────────────────────
router.post('/:id/execute', async (req, res) => {
  const { id } = req.params;

  const order = orderBook.orders.get(id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  if (order.type !== 'buy') {
    return res.status(400).json({ error: 'Only buy orders can be executed' });
  }

  const trade = orderBook.executeOrder(id);

  if (!trade) {
    return res.status(200).json({ message: 'No matching sell order found' });
  }

  // Save trade to MongoDB
  await Trade.create({
    buyOrderId: trade.buyOrderId,
    sellOrderId: trade.sellOrderId,
    buyerId: trade.buyerId,
    sellerId: trade.sellerId,
    price: trade.price,
    quantity: trade.quantity
  });

  const io = req.app.get('io');
  io.emit('tradeExecuted', { trade });
  io.emit('snapshot', orderBook.getSnapshot());

  res.json({ message: 'Trade executed!', trade });
});

module.exports = router;