import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { productsAPI } from "../services/api";
import ProductCard from "../components/common/ProductCard";

const CategoryPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        // Use the slug directly from the URL params
        const response = await productsAPI.getProductsByCategory(category);
        setProducts(response.data.data.products || []);
      } catch (err) {
        setError("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-white" style={{background:'#061f1c'}}>Loading products...</div>
    );
  if (error)
    return (
      <div className="text-center py-16 text-red-500" style={{background:'#061f1c'}}>{error}</div>
    );
  if (!products.length)
    return (
      <div className="text-center py-16 text-gray-200" style={{background:'#061f1c'}}>No products found in this category.</div>
    );

  return (
    <div className="min-h-screen w-full py-12 px-4" style={{background:'#061f1c'}}>
      <h1 className="text-4xl font-bold mb-10 text-center text-white drop-shadow-lg capitalize">{category.replace(/-/g, ' ')} Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div key={product.id} className="rounded-2xl shadow-lg p-4" style={{background:'#f5f5dc'}}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage; 