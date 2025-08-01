import React, { useEffect, useState } from "react";
import { productsAPI } from "../services/api";
import ProductCard from "../components/common/ProductCard";

const PRODUCTS_PER_PAGE = 12;

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all products by setting a high limit
        const response = await productsAPI.getAllProducts({ limit: 1000, page: 1 });
        setProducts(response.data.data.products || []);
      } catch (err) {
        setError("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + PRODUCTS_PER_PAGE);
  };

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
      <div className="text-center py-16 text-gray-200" style={{background:'#061f1c'}}>No products found.</div>
    );

  const visibleProducts = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;

  return (
    <div className="min-h-screen w-full py-12 px-4" style={{background:'#061f1c'}}>
      <h1 className="text-4xl font-bold mb-10 text-center text-white drop-shadow-lg">All Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {visibleProducts.map((product) => (
          <div key={product.id} className="rounded-2xl shadow-lg p-4" style={{background:'#f5f5dc'}}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
      {hasMore && (
        <div className="flex justify-center mt-10">
          <button
            onClick={handleShowMore}
            className="bg-lime-400 hover:bg-lime-300 text-[#061f1c] font-bold px-8 py-3 rounded-full text-lg shadow transition-all"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsPage; 