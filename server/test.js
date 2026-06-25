const orderBook = require('./orderBook');
const { v4: uuidv4 } = require('uuid');

// Place a sell order first
orderBook.placeOrder({
  id: uuidv4(),
  userId: 'user1',
  type: 'sell',
  price: 65000,
  quantity: 1.0
});

// Place a buy order
const buyOrder = {
  id: uuidv4(),
  userId: 'user2',
  type: 'buy',
  price: 65000,
  quantity: 0.5
};
orderBook.placeOrder(buyOrder);

// Try to execute/match them
const trade = orderBook.executeOrder(buyOrder.id);
console.log('Trade result:', trade);

// See the book state
console.log('Snapshot:', JSON.stringify(orderBook.getSnapshot(), null, 2));