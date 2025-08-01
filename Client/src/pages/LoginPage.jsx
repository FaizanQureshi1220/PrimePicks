"use client"

import loginImg from '../assets/login.avif'
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await login(formData);
    setLoading(false);
    if (result.success) {
      navigate("/");
    } else {
      setError(result.error);
    }
  };

  return (
    <>
      <div className="w-screen h-screen flex">
        {/* Left: Image with overlay */}
        <div className="hidden md:flex w-1/2 h-full relative">
          <img src={loginImg} alt="Login Visual" className="object-cover w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a2a23]/80 to-[#1de782]/40" />
        </div>
        {/* Right: Form */}
        <div className="flex flex-1 items-center justify-center bg-[#061f1c]">
          <div className="w-full max-w-md bg-white/90 rounded-2xl shadow-2xl p-10 flex flex-col gap-6">
            <h2 className="text-4xl font-bold text-[#0a2a23] mb-2 text-center">Login</h2>
            {error && <div className="text-red-600 text-center">{error}</div>}
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full border-b-2 border-[#1de782] bg-transparent text-[#0a2a23] placeholder-[#0a2a23]/60 py-2 px-1 focus:outline-none focus:border-[#0a2a23] transition-colors"
              />
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full border-b-2 border-[#1de782] bg-transparent text-[#0a2a23] placeholder-[#0a2a23]/60 py-2 px-1 focus:outline-none focus:border-[#0a2a23] transition-colors"
              />
              <button type="submit" disabled={loading} className="w-full bg-[#1de782] hover:bg-[#0a2a23] hover:text-white text-[#0a2a23] font-bold py-2 rounded-full transition-all mt-2">
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
            <div className="flex justify-between mt-2 text-sm text-[#0a2a23]">
              <button type="button" className="hover:underline" onClick={() => navigate('/signup')}>Create an Account?</button>
              <span className="hover:underline cursor-pointer">Forgot Password?</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default LoginPage
