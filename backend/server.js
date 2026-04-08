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

const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DATABASE_URL || 'mongodb://localhost:27017/quantum-pix';

if (!/^mongodb(\+srv)?:\/\//.test(mongoUri)) {
  console.error('MongoDB connection error: Invalid connection string.');
  console.error('Please set MONGODB_URI or DATABASE_URL to a valid MongoDB URI starting with mongodb:// or mongodb+srv://');
  process.exit(1);
}

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

// Configure Mongoose to fail fast if MongoDB is disconnected
mongoose.set('bufferCommands', false);
mongoose.set('strictQuery', false);

const connectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000,
};

// Connect to MongoDB
mongoose.connect(mongoUri, connectOptions)
.then(async () => {
  console.log('MongoDB connected successfully');

  // Seed database in background (don't block startup)
  setTimeout(async () => {
    try {
      console.log('Checking database...');
      const Photographer = require('./models/Photographer');
      const count = await Photographer.countDocuments();
      console.log(`Found ${count} photographers in database`);

      if (count === 0) {
        console.log('Database is empty, starting seed...');
        const { seedDatabase } = require('./seed');
        await seedDatabase();
        const newCount = await Photographer.countDocuments();
        console.log(`Database seeded successfully with ${newCount} photographers`);
      } else {
        console.log('Database already has data, skipping seed');
      }
    } catch (error) {
      console.error('Error during database seeding:', error.message);
      console.error('Stack:', error.stack);
    }
  }, 3000);
})
.catch(err => {
  console.error('MongoDB connection error:', err.message);
  console.error('Please check your MONGODB_URI, MONGO_URI or DATABASE_URL environment variable');
  process.exit(1);
});

mongoose.connection.on('connected', () => {
  console.log('Mongoose connection event: connected');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection event: error', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.warn('Mongoose connection event: disconnected');
});

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
  const connectionStates = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  try {
    const connectionState = connectionStates[mongoose.connection.readyState] || 'unknown';
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        status: 'error',
        message: 'MongoDB not connected',
        mongooseConnection: connectionState
      });
    }

    const Photographer = require('./models/Photographer');
    const count = await Photographer.countDocuments();
    res.json({ 
      status: 'ok', 
      photographersCount: count,
      mongooseConnection: connectionState
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
      mongooseConnection: connectionStates[mongoose.connection.readyState] || 'unknown'
    });
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