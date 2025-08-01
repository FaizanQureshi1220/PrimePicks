"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { authAPI } from "../services/api"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      fetchUserProfile()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUserProfile = async () => {
    try {
      const response = await authAPI.getProfile()
      setUser(response.data.data.user)
    } catch (error) {
      localStorage.removeItem("token")
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials)
      const { token, user } = response.data.data
      localStorage.setItem("token", token)
      setUser(user)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || "Login failed" }
    }
  }

  const signup = async (userData) => {
    try {
      const response = await authAPI.signup(userData)
      const { token, user } = response.data.data
      localStorage.setItem("token", token)
      setUser(user)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || "Signup failed" }
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
  }

  const updateAddress = async (address) => {
    try {
      await authAPI.updateProfile({ address });
      await fetchUserProfile();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || "Failed to update address" };
    }
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
    fetchUserProfile,
    updateAddress,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
