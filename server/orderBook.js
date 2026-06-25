class OrderBook {
  constructor() {
    this.bids = new Map();
    this.asks = new Map();
    this.orders = new Map();
    this.tradeHistory = [];
  }

  placeOrder(order) {
    const book = order.type === 'buy' ? this.bids : this.asks;

    if (!book.has(order.price)) {
      book.set(order.price, []);
    }

    book.get(order.price).push(order);
    this.orders.set(order.id, order);

    console.log(`Order placed: ${order.type} ${order.quantity} @ $${order.price}`);
    return order;
  }

  cancelOrder(orderId) {
    const order = this.orders.get(orderId);
    if (!order) return null;

    const book = order.type === 'buy' ? this.bids : this.asks;
    const queue = book.get(order.price);

    const index = queue.findIndex(o => o.id === orderId);
    if (index !== -1) queue.splice(index, 1);

    if (queue.length === 0) book.delete(order.price);

    this.orders.delete(orderId);
    return order;
  }

executeOrder(buyOrderId) {
    const buyOrder = this.orders.get(buyOrderId);
    if (!buyOrder || buyOrder.type !== 'buy') return null;

    const matchingAskPrice = [...this.asks.keys()]
      .filter(price => price <= buyOrder.price)
      .sort((a, b) => a - b)[0];

    if (matchingAskPrice === undefined) {
      console.log('No matching sell order found');
      return null;
    }
    
 const sellQueue = this.asks.get(matchingAskPrice);
const sellOrder = sellQueue[0]; // peek, don't remove yet

const tradeQty = Math.min(buyOrder.quantity, sellOrder.quantity);

// Partial fill — reduce sell order quantity
if (sellOrder.quantity > buyOrder.quantity) {
  sellOrder.quantity -= buyOrder.quantity; // reduce remaining
} else {
  // Fully filled — remove sell order
  sellQueue.shift();
  if (sellQueue.length === 0) this.asks.delete(matchingAskPrice);
  this.orders.delete(sellOrder.id);
}

this.cancelOrder(buyOrderId);

const trade = {
  id: Date.now().toString(),
  buyOrderId,
  sellOrderId: sellOrder.id,
  buyerId: buyOrder.userId,
  sellerId: sellOrder.userId,
  price: matchingAskPrice,
  quantity: tradeQty,       // ← use actual traded quantity
  timestamp: new Date()
};

    this.tradeHistory.push(trade);
    console.log(`Trade executed: ${trade.quantity} @ $${trade.price}`);
    return trade;
  }

  getSnapshot() {
    return {
      bids: [...this.bids.entries()]
        .sort((a, b) => b[0] - a[0])
        .map(([price, queue]) => ({ price, orders: queue })),
      asks: [...this.asks.entries()]
        .sort((a, b) => a[0] - b[0])
        .map(([price, queue]) => ({ price, orders: queue })),
      tradeHistory: this.tradeHistory.slice(-20)
    };
  }
}

module.exports = new OrderBook();