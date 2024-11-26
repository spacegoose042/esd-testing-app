# ESD Testing Backend API

## Setup
1. Clone repository
2. Copy `.env.example` to `.env` and update variables
3. Install dependencies: `npm install`
4. Initialize database: `npm run init-db`
5. Start development server: `npm run dev`

## Environment Variables
- PORT: Server port (default 5001)
- FRONTEND_URL: Frontend application URL
- JWT_SECRET: Secret for JWT tokens
- DATABASE_URL: PostgreSQL connection string
- EMAIL_USER: Email for notifications
- EMAIL_PASS: Email password

## API Routes
- POST /api/auth/login - User login
- GET /api/users - Get all users (auth required)
- POST /api/tests - Submit test result
- GET /api/health - Health check endpoint