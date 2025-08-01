import axios from "axios"

const BASE_URL = "http://localhost:3000/api/"

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth API
export const authAPI = {
  signup: (userData) => api.post("/auth/signup", userData),
  login: (credentials) => api.post("/auth/login", credentials),
  getProfile: () => api.get("/auth/profile"),
  updateProfile: (data) => api.put("/auth/profile", data),
}

// Products API
export const productsAPI = {
  getAllProducts: (params = {}) => api.get("/products/", { params }),
  getProductsByCategory: (category) => api.get(`/products/category/${category}`),
  getProductsByGender: (gender) => api.get(`/products/gender/${gender}`),
  getProductById: (id) => api.get(`/products/${id}`),
  searchProducts: (query) => api.get(`/products/search/${query}`),
  getAllCategories: () => api.get("/products/categories/all"),
}

// Cart API
export const cartAPI = {
  getCart: () => api.get("/cart/"),
  addToCart: (item) => api.post("/cart/add", item),
  updateCartItem: (itemId, quantity) => api.put(`/cart/update/${itemId}`, { quantity }),
  removeFromCart: (itemId) => api.delete(`/cart/remove/${itemId}`),
  clearCart: () => api.delete("/cart/clear"),
  getCartSummary: () => api.get("/cart/summary"),
}

// Checkout API
export const checkoutAPI = {
  processCheckout: (orderData) => api.post("/checkout/process", orderData),
  getOrderById: (orderId) => api.get(`/checkout/order/${orderId}`),
  getUserOrders: (userId) => api.get(`/checkout/orders/${userId}`),
  validateAddress: (address) => api.post("/checkout/validate-address", address),
}

export default api
