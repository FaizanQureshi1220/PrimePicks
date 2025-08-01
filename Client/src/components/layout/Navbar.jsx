"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Package, Search, Menu } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useAuth } from "../../context/AuthContext"
import { useCart } from "../../context/CartContext"

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { cartCount } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search/${searchQuery}`)
      setSearchQuery("")
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <nav className="bg-[#061f1c] w-full py-2 sticky top-0 z-50 shadow-lg h-20 flex items-center">
      <div className="max-w-7xl mx-auto flex items-center justify-between w-full px-4">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <Package className="h-7 w-7 text-white" />
          <span className="text-xl font-bold text-white hidden sm:block">PrimePicks</span>
        </div>
        {/* Search Bar (mobile: icon, md+: input) */}
        <div className="flex-1 flex justify-center items-center mx-2">
          <form onSubmit={handleSearch} className="hidden md:flex items-center bg-white rounded-md px-2 py-1 w-64 border-2 border-transparent focus-within:border-lime-400 hover:border-lime-400 shadow-sm">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-black px-2 py-1 text-base placeholder-gray-500"
            />
            <button type="submit" className="text-[#061f1c] font-bold px-2 hover:text-lime-500 transition-colors">
              <Search className="h-5 w-5" />
            </button>
          </form>
          {/* Mobile search icon */}
          <button onClick={() => setMenuOpen(false)} className="md:hidden ml-2">
            <Search className="h-6 w-6 text-white" />
          </button>
        </div>
        {/* Desktop Nav Links & Auth (hidden on mobile) */}
        <div className="hidden md:flex items-center gap-6 ml-8">
          <Link to="/" className="text-white text-lg font-normal hover:underline transition-colors">Home</Link>
          <Link to="/products" className="text-white text-lg font-normal hover:underline transition-colors">Products</Link>
          {user ? (
            <>
              <div className="relative cursor-pointer" onClick={() => navigate('/cart')}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.836l.383 1.437m0 0l1.7 6.385m-.383-7.822L6.75 7.5m0 0h10.5m-10.5 0l1.5 6h7.5l1.5-6m-10.5 0l-1.5 6m13.5-6l1.5 6m-1.5-6h-10.5m10.5 0l-1.5 6m-7.5 6.75a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm10.5 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-lime-400 text-[#061f1c] text-xs font-bold rounded-full px-2 py-0.5 border-2 border-[#061f1c]">{cartCount}</span>
                )}
              </div>
              <button onClick={() => navigate('/profile')} className="bg-lime-400 text-[#061f1c] font-bold px-5 py-2 rounded-lg text-lg shadow hover:bg-lime-300 transition-all">Profile</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="text-white text-lg font-normal bg-transparent border-none outline-none cursor-pointer">Login</button>
              <button onClick={() => navigate('/signup')} className="bg-lime-400 text-[#061f1c] font-bold px-5 py-2 rounded-lg text-lg shadow hover:bg-lime-300 transition-all">Start Now</button>
            </>
          )}
        </div>
        {/* Hamburger menu for mobile */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setMenuOpen(!menuOpen)} className="focus:outline-none">
            <Menu className="h-8 w-8 text-white" />
          </button>
          {/* Dropdown menu */}
          {menuOpen && (
            <div className="absolute top-16 right-4 bg-[#061f1c] rounded-lg shadow-lg w-56 flex flex-col z-50 animate-fade-in">
              <Link to="/" className="text-white px-6 py-3 text-lg hover:bg-lime-400 hover:text-[#061f1c] rounded-t-lg" onClick={() => setMenuOpen(false)}>Home</Link>
              <Link to="/products" className="text-white px-6 py-3 text-lg hover:bg-lime-400 hover:text-[#061f1c]" onClick={() => setMenuOpen(false)}>Products</Link>
              {user ? (
                <>
                  <div className="flex items-center px-6 py-3 cursor-pointer hover:bg-lime-400 hover:text-[#061f1c] text-white text-lg font-semibold" onClick={() => {navigate('/cart'); setMenuOpen(false)}}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 mr-2 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.836l.383 1.437m0 0l1.7 6.385m-.383-7.822L6.75 7.5m0 0h10.5m-10.5 0l1.5 6h7.5l1.5-6m-10.5 0l-1.5 6m13.5-6l1.5 6m-1.5-6h-10.5m10.5 0l-1.5 6m-7.5 6.75a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm10.5 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    </svg>
                    Cart {cartCount > 0 && <span className="ml-1 bg-lime-400 text-[#061f1c] text-xs font-bold rounded-full px-2 py-0.5">{cartCount}</span>}
                  </div>
                  <div className="flex items-center px-6 py-3 cursor-pointer hover:bg-lime-400 hover:text-[#061f1c] text-white text-lg font-semibold" onClick={() => {navigate('/profile'); setMenuOpen(false)}}>
                    Profile
                  </div>
                  <div className="flex items-center px-6 py-3 cursor-pointer hover:bg-red-400 hover:text-white text-white text-lg font-semibold" onClick={() => {handleLogout(); setMenuOpen(false)}}>
                    Logout
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center px-6 py-3 cursor-pointer hover:bg-lime-400 hover:text-[#061f1c] text-white text-lg font-semibold" onClick={() => {navigate('/login'); setMenuOpen(false)}}>
                    Login
                  </div>
                  <div className="flex items-center px-6 py-3 cursor-pointer hover:bg-lime-400 hover:text-[#061f1c] rounded-b-lg text-white text-lg font-semibold" onClick={() => {navigate('/signup'); setMenuOpen(false)}}>
                    Start Now
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
