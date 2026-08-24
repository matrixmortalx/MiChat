const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { createServer } = require('http');
const socketIO = require('socket.io');
require('dotenv').config();

const app = express();
const httpServer = createServer(app);
const io = socketIO(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Routes
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/users', require('./routes/userRoutes'));
app.use('/api/v1/chats', require('./routes/chatRoutes'));
app.use('/api/v1/messages', require('./routes/messageRoutes'));
app.use('/api/v1/groups', require('./routes/groupRoutes'));
app.use('/api/v1/files', require('./routes/fileRoutes'));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// WebSocket Connection
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log(`New user connected: ${socket.id}`);

  // User online
  socket.on('user:online', (userId) => {
    connectedUsers.set(userId, socket.id);
    io.emit('user:status', { userId, status: 'online' });
  });

  // Send message
  socket.on('message:send', (data) => {
    const { chatId, recipientId, message } = data;
    const recipientSocketId = connectedUsers.get(recipientId);
    
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('message:received', {
        chatId,
        message,
        timestamp: new Date(),
      });
    }
  });

  // Typing indicator
  socket.on('message:typing', (data) => {
    const { chatId, userId } = data;
    socket.broadcast.emit('user:typing', { chatId, userId });
  });

  // Mark message as read
  socket.on('message:read', (data) => {
    const { messageId, userId } = data;
    io.emit('message:read', { messageId, userId });
  });

  // User offline
  socket.on('user:offline', (userId) => {
    connectedUsers.delete(userId);
    io.emit('user:status', { userId, status: 'offline' });
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    // Find and remove user from connectedUsers
    for (const [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        io.emit('user:status', { userId, status: 'offline' });
        break;
      }
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 MiChat Backend running on port ${PORT}`);
  console.log(`📡 WebSocket ready for connections`);
});

module.exports = { app, io };
