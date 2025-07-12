# ReWear - Community Clothing Exchange

A full-stack MERN application for sustainable fashion through community-driven clothing exchange.

## Features

### User Features
- **User Authentication**: Email/password signup and login
- **Item Management**: Upload, browse, and manage clothing items
- **Swap System**: Direct item swaps between users
- **Points System**: Earn and redeem points for items
- **Search & Filters**: Find items by category, condition, size, etc.
- **User Dashboard**: Track items, swaps, and points

### Admin Features
- **Item Moderation**: Approve/reject item listings
- **Platform Oversight**: View statistics and manage users
- **Content Management**: Remove inappropriate content

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **React Hot Toast** for notifications
- **Lucide React** for icons

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Validator** for input validation

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rewear-community-exchange
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   
   Create a `.env` file in the `server` directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/rewear
   JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
   JWT_EXPIRE=30d
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Run the application**
   ```bash
   npm run dev
   ```

   This will start both the frontend (http://localhost:5173) and backend (http://localhost:5000) concurrently.

## Project Structure

```
rewear-community-exchange/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   └── ...
├── server/                 # Express backend
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   └── server.js           # Entry point
└── package.json            # Root package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Items
- `GET /api/items` - Get all items (with filters)
- `GET /api/items/:id` - Get single item
- `POST /api/items` - Create new item
- `GET /api/items/user` - Get user's items
- `POST /api/items/:id/redeem` - Redeem item with points

### Swaps
- `GET /api/swaps/user` - Get user's swaps
- `POST /api/swaps` - Create swap request
- `PATCH /api/swaps/:id/accept` - Accept swap
- `PATCH /api/swaps/:id/reject` - Reject swap

### Admin
- `GET /api/admin/stats` - Get platform statistics
- `GET /api/admin/pending-items` - Get pending items
- `PATCH /api/admin/items/:id/approve` - Approve item
- `PATCH /api/admin/items/:id/reject` - Reject item

## Key Features Explained

### Points System
- Users start with 100 points
- Earn 10 points for each item listed
- Item point values based on condition:
  - New: 100 points
  - Like New: 80 points
  - Good: 60 points
  - Fair: 40 points

### Item Status Flow
1. **Pending**: Newly listed items awaiting admin approval
2. **Available**: Approved items ready for swapping/redemption
3. **Swapped**: Items involved in completed swaps
4. **Redeemed**: Items redeemed using points
5. **Rejected**: Items rejected by admin

### Admin Moderation
- All new items require admin approval
- Admins can view platform statistics
- Content moderation to maintain quality

## Default Admin Account

To create an admin user, manually update a user's role in the database:

```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.