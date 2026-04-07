# Database Setup Guide for Quantum Pix

## Option 1: MongoDB Atlas (Recommended - Cloud Database)

### Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/atlas/database
2. Click "Try Free" and create an account
3. Choose the free tier (M0)

### Step 2: Create a Cluster
1. Click "Build a Database" → "M0 Cluster" → "Create"
2. Choose your preferred cloud provider and region
3. Click "Create Cluster" (takes 5-10 minutes)

### Step 3: Set up Database Access
1. Go to "Database Access" → "Add New Database User"
2. Choose "Password" authentication
3. Set username and password (save these!)
4. Click "Add User"

### Step 4: Configure Network Access
1. Go to "Network Access" → "Add IP Address"
2. Click "Allow Access from Anywhere" (0.0.0.0/0)
3. Click "Confirm"

### Step 5: Get Connection String
1. Go to "Clusters" → "Connect"
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `<database>` with `quantum-pix`

### Step 6: Update Environment Variables
Update your `backend/.env` file:
```env
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/quantum-pix?retryWrites=true&w=majority
```

## Option 2: Local MongoDB Installation

### For Windows:
1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Install MongoDB
3. Create data directory: `mkdir C:\data\db`
4. Start MongoDB: `mongod` (in a separate terminal)
5. Your .env is already configured for local MongoDB

### For macOS:
```bash
brew install mongodb-community
brew services start mongodb-community
```

### For Linux:
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

## Testing Database Connection

Run the database connection test:

```bash
cd backend
npm run test-db
```

You should see:
```
MongoDB Connected: cluster0.xxxxx.mongodb.net
Database: quantum-pix
Available collections: []
Database connection test completed successfully!
```

## Database Schema

The application uses the following collections:

- **users**: User accounts (customers, photographers, admins)
- **photographers**: Photographer profiles and portfolios
- **bookings**: Event bookings and payments
- **reviews**: User reviews and ratings

## Troubleshooting

### Connection Issues:
1. Check your internet connection (for Atlas)
2. Verify your connection string
3. Ensure IP whitelist includes your IP (Atlas)
4. Check if MongoDB is running (local)

### Common Errors:
- `Authentication failed`: Check username/password
- `Server selection timeout`: Check network/IP whitelist
- `Database not found`: Database is created automatically on first write

## Next Steps

Once connected:
1. Start the backend server: `npm run dev`
2. Test API endpoints with Postman
3. Start the frontend: `cd ../frontend && npm start`
4. Create your first user account!