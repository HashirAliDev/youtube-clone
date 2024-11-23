# YouTube Clone Application

A full-stack video-sharing application built with React, Node.js, and MongoDB.

## Features

- Modern, responsive UI with dark theme
- YouTube API integration for video fetching
- User authentication system
- Video search and playback
- Collapsible sidebar navigation
- Saved video preferences
- Cross-device compatibility

## Tech Stack

### Frontend
- React.js
- Material-UI
- Redux for state management
- Axios for API calls

### Backend
- Node.js
- Express.js
- MongoDB
- JWT for authentication

### APIs
- YouTube Data API v3

## Prerequisites

- Node.js >= 14.x
- MongoDB
- YouTube Data API key

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```
3. Set up environment variables:
   - Create `.env` file in backend directory
   - Create `.env` file in frontend directory

4. Start the development servers:
   ```bash
   # Start backend server
   cd backend
   npm run dev

   # Start frontend server
   cd frontend
   npm start
   ```

## Environment Variables

### Backend
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

### Frontend
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_YOUTUBE_API_KEY=your_youtube_api_key
```

## Project Structure

```
youtube-clone/
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── redux/
│       ├── services/
│       └── utils/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── utils/
└── README.md
```
