import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';

import ordersRoutes from './routes/orders.js';
import payazaRoutes from './routes/payaza.js';
import aiConceptorRoutes from './routes/aiConceptor.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/orders', ordersRoutes);
app.use('/api/payaza', payazaRoutes);
app.use('/api/ai', aiConceptorRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    app: 'LOOM Virtual Atelier API',
    gateway: 'Payaza Direct Checkout',
    timestamp: new Date().toISOString()
  });
});

// Socket.io fitting room orchestration
io.on('connection', (socket) => {
  console.log('⚡ Client connected to fitting room socket:', socket.id);

  socket.on('join_room', (roomCode) => {
    socket.join(roomCode);
    console.log(`Patron joined room ${roomCode}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected from socket:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`✨ LOOM Virtual Atelier Express API running on port ${PORT}`);
  console.log(`💳 Active Payment Gateway: Payaza`);
});
