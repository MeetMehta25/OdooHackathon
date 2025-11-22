# Backend API

Backend server for ODOO project built with Node.js, Express, TypeScript, and MySQL.

## Prerequisites

- Node.js (v18 or higher)
- MySQL Workbench
- npm or yarn

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

1. Open MySQL Workbench
2. Create a new connection or use an existing one
3. Run the SQL script located at `database/schema.sql` to create the database and tables
4. Note your database credentials (host, port, username, password, database name)

### 3. Environment Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your configuration:
   ```
   NODE_ENV=development
   PORT=5000
   
   # MySQL Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=odoo_db
   
   # JWT Secret (generate a random string)
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRE=7d
   
   # CORS Origin (your Next.js frontend URL)
   CORS_ORIGIN=http://localhost:3000
   ```

### 4. Run the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Build for production:**
```bash
npm run build
npm start
```

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files (database, app config)
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Custom middleware (auth, error handling, validation)
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── types/           # TypeScript types and interfaces
│   ├── utils/           # Utility functions
│   └── server.ts        # Entry point
├── database/            # SQL schema files
├── dist/                # Compiled JavaScript (generated)
├── .env                 # Environment variables (create from .env.example)
├── .env.example         # Example environment variables
├── .gitignore
├── package.json
└── tsconfig.json
```

## API Endpoints

### Health Check
- `GET /health` - Check if server is running

### User Routes
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get current user profile (protected)
- `GET /api/users` - Get all users (protected)
- `GET /api/users/:id` - Get user by ID (protected)
- `PUT /api/users/:id` - Update user (protected)
- `DELETE /api/users/:id` - Delete user (protected)

### Authentication

Protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Frontend Integration Guide

When integrating with your Next.js frontend:

1. **API Base URL**: Use `http://localhost:5000` (or your configured PORT)
2. **CORS**: Already configured to accept requests from `http://localhost:3000`
3. **Authentication**: 
   - Store JWT token after login/register
   - Include token in Authorization header for protected routes
4. **Response Format**: All responses follow this structure:
   ```typescript
   {
     success: boolean,
     message: string,
     data?: any,
     error?: string
   }
   ```

## Example API Calls

### Register User
```javascript
fetch('http://localhost:5000/api/users/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
    name: 'John Doe'
  })
})
```

### Login
```javascript
fetch('http://localhost:5000/api/users/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
})
```

### Get Profile (Protected)
```javascript
fetch('http://localhost:5000/api/users/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

## Available Scripts

- `npm run dev` - Start development server with auto-reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Adding New Features

### 1. Create a Model
Add a new model in `src/models/` (e.g., `product.model.ts`)

### 2. Create a Controller
Add controller functions in `src/controllers/` (e.g., `product.controller.ts`)

### 3. Create Routes
Add routes in `src/routes/` (e.g., `product.routes.ts`)

### 4. Register Routes
Import and use routes in `src/server.ts`:
```typescript
import productRoutes from './routes/product.routes';
app.use('/api/products', productRoutes);
```

## Troubleshooting

### Database Connection Issues
- Verify MySQL is running
- Check database credentials in `.env`
- Ensure database `odoo_db` exists

### Port Already in Use
- Change `PORT` in `.env` file
- Or stop the process using port 5000

### TypeScript Errors
- Run `npm install` to ensure all dependencies are installed
- Check `tsconfig.json` configuration

## Next Steps

1. Run `npm install` to install all dependencies
2. Set up your MySQL database using the schema file
3. Configure your `.env` file
4. Run `npm run dev` to start the development server
5. Test the API using tools like Postman or your frontend application

## Support

For issues or questions, refer to the documentation or check the error logs in the console.
