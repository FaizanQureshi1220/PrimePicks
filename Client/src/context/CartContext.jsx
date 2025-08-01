"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { cartAPI } from "../services/api"
import { useAuth } from "./AuthContext"

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const [cartCount, setCartCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [forceUpdate, setForceUpdate] = useState(0)
  const { user } = useAuth()

  // Fetch cart on mount and when user changes
  useEffect(() => {
    if (user) {
      fetchCart()
    } else {
      setCart([])
      setCartCount(0)
    }
    // eslint-disable-next-line
  }, [user])

  const fetchCart = async () => {
    try {
      setLoading(true)
      const response = await cartAPI.getCart()
      const items = response.data.data?.cart?.items || []
      setCart(items)
      setCartCount(items.length)
      setForceUpdate(f => f + 1) // force re-render for consumers
      console.log("[CartContext] Cart updated:", items)
      console.log("[CartContext] Cart count:", items.length)
    } catch (error) {
      setCart([])
      setCartCount(0)
      setForceUpdate(f => f + 1)
      console.error("Error fetching cart:", error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (product, quantity = 1) => {
    try {
      await cartAPI.addToCart({ productId: product.id, quantity })
      await fetchCart()
      setForceUpdate(f => f + 1)
      return { success: true }
    } catch (error) {
      setForceUpdate(f => f + 1)
      return { success: false, error: error.response?.data?.message || "Failed to add to cart" }
    }
  }

  const updateCartItem = async (itemId, quantity) => {
    try {
      await cartAPI.updateCartItem(itemId, quantity)
      await fetchCart()
      setForceUpdate(f => f + 1)
      return { success: true }
    } catch (error) {
      setForceUpdate(f => f + 1)
      return { success: false, error: error.response?.data?.message || "Failed to update cart" }
    }
  }

  const removeFromCart = async (itemId) => {
    try {
      await cartAPI.removeFromCart(itemId)
      await fetchCart()
      setForceUpdate(f => f + 1)
      return { success: true }
    } catch (error) {
      setForceUpdate(f => f + 1)
      return { success: false, error: error.response?.data?.message || "Failed to remove from cart" }
    }
  }

  const clearCart = async () => {
    try {
      await cartAPI.clearCart()
      setCart([])
      setCartCount(0)
      setForceUpdate(f => f + 1)
      return { success: true }
    } catch (error) {
      setForceUpdate(f => f + 1)
      return { success: false, error: error.response?.data?.message || "Failed to clear cart" }
    }
  }

  const value = {
    cart,
    cartCount,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    fetchCart,
    forceUpdate, // for debugging/forcing re-render
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
