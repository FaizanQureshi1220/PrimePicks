# PrimePicks Backend API

A comprehensive e-commerce backend API for the PrimePicks platform, built with Express.js, Prisma, and PostgreSQL (NeonDB).

---

## 🚀 Features

- **Authentication**: JWT-based login/signup system, user profile management
- **Product Management**: Real-time product fetching from [dummyjson.com](https://dummyjson.com/products), category/gender/search endpoints
- **Shopping Cart**: In-memory cart, real-time product details
- **Checkout System**: Order processing, payment simulation, order history in PostgreSQL
- **Security**: CORS, Helmet, input validation, JWT
- **Error Handling**: Consistent error responses

---

## 📁 Project Structure

```
Server/
├── routes/
│   ├── auth.js          # Authentication routes (login/signup/profile)
│   ├── products.js      # Product routes (homepage, category, gender, search, by ID)
│   ├── cart.js          # Cart management routes
│   └── checkout.js      # Checkout and order processing
├── middleware/
│   ├── auth.js          # JWT authentication middleware
│   └── errorHandler.js  # Error handling middleware
├── prisma/
│   └── schema.prisma    # Prisma schema for PostgreSQL
├── services/
│   └── productService.js# Service for external product API
├── config/
│   └── database.js      # Config loader
├── server.js            # Main server file
├── package.json         # Dependencies and scripts
├── SETUP.md             # Setup and environment guide
└── README.md            # This file
```

---

## 🌐 Active API Routes

### Authentication (`/api/auth`)
| Method | Endpoint         | Description                | Auth Required | Body/Params |
|--------|------------------|----------------------------|---------------|-------------|
| POST   | `/signup`        | Register a new user        | No            | `{ username, email, password }` |
| POST   | `/login`         | Login user                 | No            | `{ email, password }` |
| GET    | `/profile`       | Get user profile           | Yes (JWT)     | Header: `Authorization: Bearer <token>` |
| PUT    | `/profile`       | Update user profile        | Yes (JWT)     | `{ username?, email? }` |

### Products (`/api/products`)
| Method | Endpoint                        | Description                        | Query/Params |
|--------|----------------------------------|------------------------------------|--------------|
| GET    | `/`                              | Get all products (homepage)        | `page`, `limit`, `category`, `brand`, `minPrice`, `maxPrice` |
| GET    | `/category/:category`            | Get products by category           | `page`, `limit` |
| GET    | `/gender/:gender`                | Get products by gender             | `page`, `limit` |
| GET    | `/:id`                           | Get product by ID                  | `id` |
| GET    | `/search/:query`                 | Search products                    | `page`, `limit` |
| GET    | `/categories/all`                | Get all product categories         | None |

**Note:** All product data is fetched in real-time from [dummyjson.com](https://dummyjson.com/products).

### Cart (`/api/cart`)
| Method | Endpoint           | Description                | Auth Required | Body/Params |
|--------|--------------------|----------------------------|---------------|-------------|
| GET    | `/`                | Get user's cart (real-time product details) | No (in-memory) | Header: `Authorization: Bearer <token>` (optional) |
| POST   | `/add`             | Add item to cart           | No (in-memory) | `{ productId, quantity, size?, color? }` |
| PUT    | `/update/:itemId`  | Update item quantity       | No (in-memory) | `{ quantity }` |
| DELETE | `/remove/:itemId`  | Remove item from cart      | No (in-memory) | None |
| DELETE | `/clear`           | Clear entire cart          | No (in-memory) | None |
| GET    | `/summary`         | Get cart summary           | No (in-memory) | None |

**Note:** Cart is stored in-memory per user/session. Product details are always fetched live from the external API.

### Checkout & Orders (`/api/checkout`)
| Method | Endpoint                   | Description                        | Auth Required | Body/Params |
|--------|----------------------------|------------------------------------|---------------|-------------|
| POST   | `/process`                 | Process checkout and create order  | Yes (userId required) | `{ cartItems, total, shippingAddress, billingAddress, paymentMethod, userId }` |
| GET    | `/order/:orderId`          | Get order by ID                    | Yes           | `orderId` |
| GET    | `/orders/:userId`          | Get user's orders                  | Yes           | `userId`, `page`, `limit` |
| PUT    | `/order/:orderId/status`   | Update order status                | Yes           | `{ status }` |
| POST   | `/shipping-cost`           | Calculate shipping cost            | No            | `{ address, items }` |
| POST   | `/validate-address`        | Validate shipping address          | No            | `{ address }` |

**Note:** Orders are stored in PostgreSQL via Prisma. Only product IDs are stored; product details are fetched live when needed.

### Health & Root
| Method | Endpoint      | Description                |
|--------|---------------|----------------------------|
| GET    | `/health`     | Health check endpoint      |
| GET    | `/`           | API root info              |

---

## 🔐 Authentication
- JWT-based, send token in `Authorization: Bearer <token>` header
- `/api/auth/signup` and `/api/auth/login` return a JWT on success
- Use the token for all protected endpoints (profile, orders, checkout)

---

## 🗄️ Database & External API
- **Users & Orders:** Stored in PostgreSQL (NeonDB) via Prisma
- **Products:** Fetched in real-time from [dummyjson.com](https://dummyjson.com/products)
- **Cart:** In-memory, stores only product IDs and user-specific info

---

## 🛠️ Environment Variables (`.env`)
```
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
PRODUCTS_API_URL=https://dummyjson.com/products
```

---

## 📦 Example Requests

**Signup:**
```json
POST /api/auth/signup
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Login:**
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Add to Cart:**
```json
POST /api/cart/add
{
  "productId": "1",
  "quantity": 2,
  "size": "10",
  "color": "black"
}
```

**Checkout:**
```json
POST /api/checkout/process
{
  "cartItems": [
    { "productId": "1", "quantity": 2, "size": "10", "color": "black" }
  ],
  "total": 150.00,
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "billingAddress": { ... },
  "paymentMethod": "credit_card",
  "userId": "<user-id-from-jwt>"
}
```

---

## 📝 Notes
- All product data is always up-to-date from the external API
- Orders and users are persisted in PostgreSQL
- Cart is session/in-memory only (not persisted)
- All sensitive data should be stored in `.env`
- For full setup, see [SETUP.md](./SETUP.md)

---

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License
This project is licensed under the ISC License. 
