const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST', 'DELETE'] }
});

app.use(cors());
app.use(express.json());
app.set('io', io);

// Routes
const orderRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');

app.use('/api/orders', orderRoutes);
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'OrderX server running!' });
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  const orderBook = require('./orderBook');
  socket.emit('snapshot', orderBook.getSnapshot());

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});