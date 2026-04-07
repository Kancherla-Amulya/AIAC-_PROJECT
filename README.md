# Quantum Pix - Photographer Booking Platform

A full-stack web application for booking professional photographers for events. Built with React, Node.js, Express, MongoDB, and modern web technologies.

## 🚀 Live Demo

**Frontend (Website)**: [https://aiac-frontend.onrender.com](https://aiac-project-5.onrender.com/)

**Backend (API)**: [https://aiac-backend.onrender.com](https://aiac-project-4.onrender.com/)

**GitHub Repository**: [https://github.com/Kancherla-Amulya/AIAC-_PROJECT](https://github.com/Kancherla-Amulya/AIAC-_PROJECT)

### Deployment Platform
- **Frontend**: Deployed on Render (Static Site)
- **Backend**: Deployed on Render (Web Service)
- **Database**: MongoDB Atlas

## Features

- **User Roles**: Customer, Photographer, Admin
- **JWT Authentication**: Secure login/signup system
- **Photographer Profiles**: Portfolio showcase, ratings, reviews
- **Booking System**: Date selection, payment integration
- **Real-time Chat**: Socket.io integration for communication
- **Image Storage**: Cloudinary integration for portfolios
- **Payment Gateway**: Razorpay integration
- **Responsive Design**: Modern UI with Tailwind CSS

## Tech Stack

### Frontend
- React.js 18
- Tailwind CSS
- React Router DOM
- Axios
- Socket.io Client
- React DatePicker
- React Icons

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing
- Cloudinary for image storage
- Razorpay for payments
- Socket.io for real-time features

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd quantum-pix
   ```

2. **Database Setup** (Choose one option):
   - **MongoDB Atlas** (Recommended): Follow `DATABASE_SETUP.md`
   - **Local MongoDB**: Install MongoDB locally

3. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your database connection and API keys
   npm run test-db  # Test database connection
   npm run dev
   ```

4. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env
   # Edit .env with your API URLs
   npm start
   ```

4. **Database**
   - Make sure MongoDB is running
   - The application will create collections automatically

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/quantum-pix
JWT_SECRET=your-jwt-secret
FRONTEND_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_RAZORPAY_KEY_ID=your-razorpay-key-id
REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-key
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Photographers
- `GET /api/photographers` - Get all photographers (with filters)
- `GET /api/photographers/:id` - Get photographer by ID
- `POST /api/photographers` - Create photographer profile
- `PUT /api/photographers/:id` - Update photographer profile

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/user` - Get user's bookings
- `GET /api/bookings/photographer` - Get photographer's bookings
- `PUT /api/bookings/:id/status` - Update booking status

### Payments
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify-payment` - Verify payment

## Project Structure

```
quantum-pix/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## Deployment

### Deployed on Render

Both frontend and backend are deployed on **Render**.

#### Backend Deployment (Web Service)

1. Create a Web Service on Render
2. Connect GitHub repository: `Kancherla-Amulya/AIAC-_PROJECT`
3. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Set environment variables (see below)
5. Deploy

**Backend URL**: `https://aiac-backend.onrender.com`

#### Frontend Deployment (Static Site)

1. Create a Static Site on Render
2. Connect GitHub repository: `Kancherla-Amulya/AIAC-_PROJECT`
3. Configure:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
4. Set environment variables (see below)
5. Deploy

**Frontend URL**: `https://aiac-frontend.onrender.com`

### Environment Variables Setup

**Backend (.env or Render Environment Variables):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quantum-pix
JWT_SECRET=your-secure-jwt-secret-key-here
FRONTEND_URL=https://aiac-frontend.onrender.com
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
FRONTEND_URL=your-frontend-url
```

**Frontend (.env or Render Environment Variables):**
```env
REACT_APP_API_URL=https://aiac-backend.onrender.com
REACT_APP_RAZORPAY_KEY_ID=your-razorpay-key-id
REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-key (optional)
```

### Database Setup

1. **MongoDB Atlas** (Recommended for production):
   - Create a cluster
   - Get connection string
   - Whitelist IP addresses
   - Create database user

2. **Local MongoDB** (For development):
   - Install MongoDB locally
   - Use `mongodb://localhost:27017/quantum-pix`

### Services Setup

1. **Cloudinary** (Image Storage):
   - Sign up at cloudinary.com
   - Get cloud name, API key, and secret

2. **Razorpay** (Payment Gateway):
   - Sign up at razorpay.com
   - Get key ID and secret
   - Set up webhook for payment verification

## Running Locally

1. **Start MongoDB**:
   ```bash
   # If using local MongoDB
   mongod
   ```

2. **Start Backend**:
   ```bash
   cd backend
   npm run dev
   ```

3. **Start Frontend**:
   ```bash
   cd frontend
   npm start
   ```

4. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@quantumpix.com or create an issue in the repository.
