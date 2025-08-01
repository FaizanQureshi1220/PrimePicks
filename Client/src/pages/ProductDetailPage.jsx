import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productsAPI } from "../services/api";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/common/ProductCard";
import { Button } from "../components/ui/button";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await productsAPI.getProductById(id);
        setProduct(res.data.data.product);
        setSelectedImage(
          res.data.data.product?.images && res.data.data.product.images.length > 0
            ? res.data.data.product.images[0]
            : res.data.data.product.image || res.data.data.product.thumbnail || "/placeholder.svg?height=350&width=350"
        );
        // Fetch related products by category
        if (res.data.data.product?.category) {
          const rel = await productsAPI.getProductsByCategory(res.data.data.product.category);
          setRelated((rel.data.data.products || []).filter(p => p.id !== res.data.data.product.id));
        }
      } catch (err) {
        setError("Product not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    setAdding(true);
    await addToCart(product);
    setAdding(false);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-white" style={{background:'#061f1c'}}>Loading product...</div>
    );
  if (error || !product)
    return (
      <div className="text-center py-16 text-red-500" style={{background:'#061f1c'}}>{error || "Product not found."}</div>
    );

  const images = product.images && product.images.length > 0
    ? product.images
    : [product.image || product.thumbnail || "/placeholder.svg?height=350&width=350"];

  return (
    <div className="min-h-screen w-full py-12 px-4" style={{background:'#061f1c'}}>
      <div className="max-w-6xl mx-auto bg-[#f5f5dc] rounded-3xl shadow-2xl p-8 flex flex-col md:flex-row gap-10">
        <div className="flex-1 flex flex-col items-center justify-center">
          <img
            src={selectedImage}
            alt={product.name}
            className="w-full max-w-xs h-80 object-cover rounded-2xl shadow-lg border-4 border-white mb-4"
            style={{background:'#fff'}}
          />
          <div className="flex gap-3 mt-2 flex-wrap justify-center">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Thumbnail ${idx+1}`}
                className={`w-16 h-16 object-cover rounded-lg border-2 cursor-pointer transition-all duration-200 ${selectedImage === img ? 'border-lime-500 ring-2 ring-lime-400' : 'border-gray-300'}`}
                onClick={() => setSelectedImage(img)}
                style={{background:'#fff'}}
              />
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-[#061f1c]">{product.name}</h1>
            <div className="text-lg text-gray-700 mb-2 font-semibold">{product.brand}</div>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-3xl font-bold text-lime-600">${product.price?.toFixed(2)}</span>
              {product.discountPercentage > 0 && (
                <span className="text-lg text-gray-400 line-through">${product.price?.toFixed(2)}</span>
              )}
              {product.discountPercentage > 0 && (
                <span className="text-md bg-red-100 text-red-600 px-3 py-1 rounded-full font-semibold">-{Math.round(product.discountPercentage)}% OFF</span>
              )}
            </div>
            <div className="mb-4 text-gray-800 text-base leading-relaxed">{product.description}</div>
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="bg-lime-100 text-lime-800 px-4 py-2 rounded-lg font-semibold">Category: {product.category}</div>
              <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg font-semibold">Rating: {product.rating?.toFixed(1)} / 5</div>
              <div className={`px-4 py-2 rounded-lg font-semibold ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>{product.inStock ? 'In Stock' : 'Out of Stock'}</div>
            </div>
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-2">
                <span className="font-semibold text-[#061f1c]">Sizes:</span> {product.sizes.join(', ')}
              </div>
            )}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-2">
                <span className="font-semibold text-[#061f1c]">Colors:</span> {product.colors.join(', ')}
              </div>
            )}
          </div>
          <Button
            onClick={handleAddToCart}
            disabled={adding || !product.inStock}
            className={`mt-4 w-full md:w-auto bg-lime-400 hover:bg-lime-300 text-[#061f1c] font-bold text-lg px-8 py-3 rounded-full shadow-lg transition-all flex items-center justify-center ${!product.inStock ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {adding ? "Adding..." : product.inStock ? "Add to Cart" : "Out of Stock"}
          </Button>
        </div>
      </div>
      {related.length > 0 && (
        <div className="max-w-6xl mx-auto mt-16">
          <h2 className="text-3xl font-bold mb-8 text-white drop-shadow-lg">Similar Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {related.map((prod) => (
              <div key={prod.id} className="rounded-2xl shadow-lg p-4" style={{background:'#f5f5dc'}}>
                <ProductCard product={prod} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage; 