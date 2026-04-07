const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const photographerRoutes = require('./routes/photographers');
const bookingRoutes = require('./routes/bookings');
const paymentRoutes = require('./routes/payments');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('MongoDB connected');
  
  // Seed database in background (don't block startup)
  setTimeout(async () => {
    try {
      const { seedDatabase } = require('./seed');
      const Photographer = require('./models/Photographer');
      const count = await Photographer.countDocuments();
      if (count === 0) {
        console.log('Database is empty, starting seed...');
        await seedDatabase();
        console.log('Database seeded successfully');
      } else {
        console.log('Database already has data');
      }
    } catch (error) {
      console.error('Error seeding database:', error);
    }
  }, 2000);
})
.catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/photographers', photographerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);

// Manual seed endpoint
app.post('/api/manual-seed', async (req, res) => {
  try {
    const { seedDatabase } = require('./seed');
    await seedDatabase();
    const Photographer = require('./models/Photographer');
    const count = await Photographer.countDocuments();
    res.json({ message: 'Database seeded successfully', photographersCount: count });
  } catch (error) {
    console.error('Manual seeding error:', error);
    res.status(500).json({ message: 'Seeding failed', error: error.message });
  }
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const Photographer = require('./models/Photographer');
    const count = await Photographer.countDocuments();
    res.json({ 
      status: 'ok', 
      photographersCount: count,
      mongooseConnection: mongoose.connection.readyState === 1 ? 'connected' : 'not connected'
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Socket.io for real-time chat
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinRoom', ({ bookingId }) => {
    socket.join(bookingId);
  });

  socket.on('sendMessage', ({ bookingId, message, sender }) => {
    io.to(bookingId).emit('receiveMessage', { message, sender, timestamp: new Date() });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;