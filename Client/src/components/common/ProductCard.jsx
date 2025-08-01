"use client"
import { useNavigate } from "react-router-dom"
import { Star, ShoppingCart } from "lucide-react"
import { Card, CardContent, CardFooter } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { useCart } from "../../context/CartContext"
import { useAuth } from "../../context/AuthContext"

const ProductCard = ({ product, className = "" }) => {
  const { addToCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  console.log("ProductCard received product:", product)

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      navigate('/login')
      return
    }

    await addToCart(product)
  }

  const handleCardClick = () => {
    navigate(`/product/${product.id}`)
  }

  const discountedPrice = product.price ? product.price - (product.price * (product.discountPercentage || 0)) / 100 : 0

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 ${className}`} onClick={handleCardClick} style={{ cursor: "pointer" }}>
      {/* Remove Link wrapper, use onClick for navigation */}
      <div className="relative overflow-hidden">
        <img
          src={product.image || product.thumbnail || "/placeholder.svg?height=200&width=200"}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = "/placeholder.svg?height=200&width=200"
          }}
        />
        {product.discountPercentage > 0 && (
          <Badge className="absolute top-2 left-2 bg-red-500">-{Math.round(product.discountPercentage || 0)}%</Badge>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors overflow-hidden text-ellipsis whitespace-nowrap">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap">{product.description}</p>
          <div className="flex items-center space-x-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating || 0) ? "text-yellow-400 fill-current" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">{(product.rating || 0).toFixed(1)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">${discountedPrice.toFixed(2)}</span>
            {product.discountPercentage > 0 && product.price && (
              <span className="text-sm text-gray-500 lne-through">${product.price.toFixed(2)}</span>
            )}
          </div>
        </div>
      </CardContent> 

      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={`w-full bg-lime-400 hover:bg-lime-300 text-[#061f1c] font-bold rounded-full shadow transition-all flex items-center justify-center ${!product.inStock ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ProductCard
