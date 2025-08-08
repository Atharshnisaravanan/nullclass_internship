const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const paymentRoutes = require('./routes/paymentRoutes');
//const planRoutes = require('./routes/planRoutes');
const { createServer } = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/payment', paymentRoutes);
//app.use('/api/plans', planRoutes);

// ----------------------
// WebSocket (Socket.io)
// ----------------------
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);

  socket.on('call-user', (data) => {
    io.to(data.userToCall).emit('receive-call', {
      signal: data.signalData,
      from: data.from,
    });
  });

  socket.on('answer-call', (data) => {
    io.to(data.to).emit('call-answered', data.signal);
  });

  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
