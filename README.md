# Node Express MongoDB App

A simple Node.js Express app that connects to MongoDB and fetches users from the `myTry` database.

## Prerequisites

- Node.js installed
- MongoDB running on localhost:27017
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Ensure MongoDB is running:
```bash
# If using MongoDB Community Edition on macOS
brew services start mongodb-community
# Or start MongoDB using Docker
docker run -d -p 27017:27017 --name mongodb mongo
```

3. Start the server:
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:3000`

## API Endpoints

### Get all users
```
GET /api/users
```
Returns all users from the `users` collection in the `myTry` database.

### Get user by ID
```
GET /api/users/:id
```
Returns a specific user by MongoDB ObjectId.

### Health check
```
GET /health
```
Check if the server is running.

## Example Responses

**GET /api/users**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    }
  ],
  "count": 1
}
```

**GET /api/users/:id**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```
