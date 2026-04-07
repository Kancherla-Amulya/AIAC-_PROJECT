const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);

    // Test the connection by creating a simple collection
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));

    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection test completed successfully!');

  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

connectDB();