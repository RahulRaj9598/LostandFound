# FindMyStuff

A modern lost and found platform built with React, Node.js, and MongoDB.

## Features

- **User Authentication**: Email verification, password & OTP login
- **Post Management**: Create, edit, delete lost/found items with images
- **Location Services**: Interactive map with Google Places API
- **Claims System**: Submit claims with evidence, owner approval workflow
- **Admin Dashboard**: User moderation, claim management
- **Email Notifications**: Digest system for claim notifications
- **Rate Limiting**: Prevents spam (3 posts per 30 minutes)
- **Security**: JWT tokens, session management, input validation

## Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Cloudinary (image uploads)
- Nodemailer (email service)
- Google Maps API

### Frontend
- React + Vite
- React Router DOM
- React Query (data fetching)
- Zustand (state management)
- Tailwind CSS
- Axios (API client)

## Setup

### Prerequisites
- Node.js (v16+)
- MongoDB
- Cloudinary account
- Google Maps API key
- SMTP email service

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd FindMyStuff
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

3. **Environment setup**
   ```bash
   # Copy environment template
   cp env.example .env
   
   # Edit .env with your actual values
   ```

4. **Start the application**
   ```bash
   # Backend (from backend/)
   npm start
   
   # Frontend (from frontend/)
   npm run dev
   ```

## Environment Variables

See `env.example` for all required environment variables.

## API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/verify-email` - Email verification
- `POST /api/v1/auth/login` - Password login
- `POST /api/v1/auth/request-login-otp` - Request OTP
- `POST /api/v1/auth/login-otp` - OTP login
- `POST /api/v1/auth/token` - Refresh token
- `POST /api/v1/auth/logout` - Logout

### Posts
- `GET /api/v1/posts` - List posts (with filters)
- `POST /api/v1/posts` - Create post
- `GET /api/v1/posts/:id` - Get post details
- `PUT /api/v1/posts/:id` - Update post
- `DELETE /api/v1/posts/:id` - Delete post

### Claims
- `GET /api/v1/claims` - List claims
- `POST /api/v1/claims` - Create claim
- `GET /api/v1/claims/:id` - Get claim details
- `PATCH /api/v1/claims/:id` - Update claim status
- `GET /api/v1/claims/:id/contact` - Get contact details

### Users
- `GET /api/v1/users/me` - Get current user
- `PUT /api/v1/users/me` - Update profile
- `POST /api/v1/users/me/avatar` - Upload avatar

### Admin
- `GET /api/v1/admin/users/pending` - Pending users
- `GET /api/v1/admin/users/all` - All users
- `PATCH /api/v1/admin/users/:id/moderate` - Moderate user
- `GET /api/v1/admin/claims/pending` - Pending claims

## Deployment

### Backend
1. Set production environment variables
2. Build and start with PM2:
   ```bash
   NODE_ENV=production pm2 start backend/src/server.js --name findmystuff-api
   ```

### Frontend
1. Build the application:
   ```bash
   npm run build
   ```
2. Deploy `dist/` folder to static hosting (Vercel, Netlify, etc.)

## Security Features

- JWT-based authentication with refresh tokens
- Rate limiting on sensitive endpoints
- Input validation and sanitization
- CORS protection
- Secure session management
- Password hashing with bcrypt

## License

MIT License
