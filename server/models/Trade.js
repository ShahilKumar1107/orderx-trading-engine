const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  buyOrderId: String,
  sellOrderId: String,
  buyerId: String,
  sellerId: String,
  price: Number,
  quantity: Number,
}, { timestamps: true });

module.exports = mongoose.model('Trade', tradeSchema);