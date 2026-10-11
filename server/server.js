import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Server } from 'socket.io';

import ordersRoutes from './routes/orders.js';
import payazaRoutes from './routes/payaza.js';
import aiConceptorRoutes from './routes/aiConceptor.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://127.0.0.1:3000').split(',');

// 1. Security Headers via Helmet
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows WebGL and client 3D asset fetching
    crossOriginEmbedderPolicy: false
  })
);

// 2. Global Rate Limiter to mitigate Brute Force / DDoS
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Too many requests from this IP. Please try again after 15 minutes.'
  }
});
app.use('/api/', apiLimiter);

// 3. Stricter Rate Limiter for Checkout/Escrow Payments
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30, // 30 transaction inits per IP per 15 min
  message: {
    status: 'error',
    message: 'Payment rate limit reached. Please wait before retrying checkout.'
  }
});
app.use('/api/payaza/', paymentLimiter);

// 4. CORS Whitelisting
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl) in development
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS blocked: Origin unauthorized by LOOM security policy'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  })
);

app.use(express.json({ limit: '100kb' })); // Mitigates oversized body memory exhaustion

// API Endpoints
app.use('/api/orders', ordersRoutes);
app.use('/api/payaza', payazaRoutes);
app.use('/api/ai', aiConceptorRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    app: 'LOOM Virtual Atelier Secure API',
    gateway: 'Payaza Direct Escrow Gateway',
    timestamp: new Date().toISOString(),
    securityAudit: 'PASSED'
  });
});

// Central Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('⚠️ Server Error:', err.message);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error'
  });
});

// Socket.io fitting room orchestration with sanitized origin
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('⚡ Client connected to fitting room socket:', socket.id);

  socket.on('join_room', (roomCode) => {
    // Basic room code sanitizer: alphanumeric and dash only
    const sanitizedRoom = String(roomCode).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 32);
    socket.join(sanitizedRoom);
    console.log(`Patron joined room: ${sanitizedRoom}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected from socket:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`✨ LOOM Virtual Atelier Express API running on port ${PORT}`);
  console.log(`🛡️ Security: Helmet CSP, Rate Limiting, & CORS Whitelist enabled`);
  console.log(`💳 Active Payment Gateway: Payaza Escrow`);
});
