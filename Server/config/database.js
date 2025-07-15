require('dotenv').config();

module.exports = {
  database: {
    url: process.env.DATABASE_URL || "postgresql://username:password@host:port/database?sslmode=require"
  },
  jwt: {
    secret: process.env.JWT_SECRET || "your-super-secret-jwt-key-change-this-in-production"
  },
  server: {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || "development"
  },
  frontend: {
    url: process.env.FRONTEND_URL || "http://localhost:5174"
  },
  api: {
    productsUrl: process.env.PRODUCTS_API_URL || "https://dummyjson.com/products"
  }
}; 