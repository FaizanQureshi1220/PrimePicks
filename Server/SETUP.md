# KicksVault Backend Setup Guide

## 🗄️ Database Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the Server directory with your database credentials:

```env
# Database (Replace with your NeonDB credentials)
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"

# JWT Secret (Change this in production)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Server Configuration
PORT=3000
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:5173

# External API
PRODUCTS_API_URL="https://dummyjson.com/products"
```

### 3. Database Setup with Prisma

#### Generate Prisma Client
```bash
npm run db:generate
```

#### Push Schema to Database
```bash
npm run db:push
```

#### (Optional) Create Migration
```bash
npm run db:migrate
```

#### (Optional) Open Prisma Studio
```bash
npm run db:studio
```

### 4. Start the Server
```bash
npm run dev
```

## 🔧 NeonDB Setup

1. **Create NeonDB Account**
   - Go to [neon.tech](https://neon.tech)
   - Sign up for a free account

2. **Create Database**
   - Create a new project
   - Copy the connection string

3. **Update .env File**
   - Replace the DATABASE_URL with your NeonDB connection string
   - Format: `postgresql://username:password@host:port/database?sslmode=require`

## 📊 API Features

### External Product API Integration
- Products are fetched from `https://dummyjson.com/products`
- Real-time product details in cart
- Caching for better performance
- Category-based filtering
- Search functionality

### Database Storage
- **Users**: Stored in PostgreSQL with Prisma
- **Orders**: Complete order history with JSON storage for flexibility
- **Cart**: In-memory storage (can be moved to database later)

### Authentication
- JWT-based authentication
- Password hashing with bcrypt
- User profile management

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Create and apply migrations
- `npm run db:studio` - Open Prisma Studio

## 🔍 Testing the API

### Health Check
```bash
curl http://localhost:3000/health
```

### Get Products
```bash
curl http://localhost:3000/api/products
```

### Get Products by Category
```bash
curl http://localhost:3000/api/products/category/smartphones
```

### Get Products by Gender
```bash
curl http://localhost:3000/api/products/gender/men
```

### Search Products
```bash
curl http://localhost:3000/api/products/search/iphone
```

## 📝 Notes

- The external API provides 100+ products across different categories
- Product details are fetched in real-time when needed
- Cart uses in-memory storage for simplicity
- Orders are stored in PostgreSQL with full history
- JWT tokens expire after 24 hours
- All sensitive data should be stored in environment variables

## 🛠️ Troubleshooting

### Database Connection Issues
1. Verify your DATABASE_URL in .env
2. Ensure NeonDB is accessible
3. Run `npm run db:generate` to regenerate Prisma client

### External API Issues
1. Check if dummyjson.com is accessible
2. Verify PRODUCTS_API_URL in config
3. Check network connectivity

### Authentication Issues
1. Verify JWT_SECRET in .env
2. Check token expiration
3. Ensure proper Authorization header format 