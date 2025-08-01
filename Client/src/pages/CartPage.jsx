import React, { useEffect } from "react";
import { useCart } from "../context/CartContext";
import { Card, CardContent, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";

const CartPage = () => {
  const { cart, cartCount, loading, fetchCart, clearCart, updateCartItem, removeFromCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line
  }, []);

  // Calculate total and discount
  const total = cart.reduce((sum, item) => {
    const price = item.product?.price || 0;
    const discount = item.product?.discountPercentage || 0;
    const discountedPrice = price - (price * discount) / 100;
    return sum + discountedPrice * (item.quantity || 1);
  }, 0);
  const totalDiscount = cart.reduce((sum, item) => {
    const price = item.product?.price || 0;
    const discount = item.product?.discountPercentage || 0;
    return sum + ((price * discount) / 100) * (item.quantity || 1);
  }, 0);

  if (loading)
    return <div className="flex justify-center items-center h-64 text-white" style={{background:'#061f1c'}}>Loading cart...</div>;
  if (!cart || cart.length === 0)
    return (
      <div className="min-h-screen w-full flex items-center justify-center" style={{background:'#061f1c'}}>
        <div className="bg-[#f5f5dc] rounded-3xl shadow-2xl p-16 flex flex-col items-center gap-8 max-w-xl w-full">
          <div className="text-5xl font-bold text-[#061f1c] mb-4 text-center">Cart is Empty</div>
          <ShoppingCart size={80} strokeWidth={1.5} className="text-lime-400 mb-2" />
          <Button
            className="bg-lime-400 hover:bg-lime-300 text-[#061f1c] font-bold px-10 py-4 rounded-full text-2xl shadow transition-all"
            onClick={() => navigate('/products')}
            type="button"
          >
            Shop Now
          </Button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen w-full py-12 px-4" style={{background:'#061f1c'}}>
      <div className="max-w-4xl mx-auto bg-[#f5f5dc] rounded-3xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-[#061f1c]">Your Cart</h1>
        <div className="space-y-6">
          {cart.map((item) => (
            <Card key={item.id} className="flex flex-col md:flex-row items-center md:items-start p-6 gap-6 bg-[#f5f5dc] shadow rounded-2xl border border-lime-400" style={{borderWidth: '2px'}}>
              <img src={item.product?.image || item.product?.thumbnail || "/placeholder.svg?height=100&width=100"} alt={item.product?.name} className="w-28 h-28 object-cover rounded-xl border-2 border-white shadow" />
              <CardContent className="flex-1 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold text-2xl text-[#061f1c]">{item.product?.name}</h2>
                  <Button
                    variant="ghost"
                    className="text-red-500 hover:bg-red-100 rounded-full p-2"
                    onClick={() => removeFromCart(item.id)}
                    title="Remove"
                    type="button"
                  >
                    <Trash2 className="w-6 h-6" />
                  </Button>
                </div>
                <div className="text-gray-700 text-lg">{item.product?.brand}</div>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xl font-bold text-lime-600">${(item.product?.price - (item.product?.price * (item.product?.discountPercentage || 0) / 100)).toFixed(2)}</span>
                  {item.product?.discountPercentage > 0 && (
                    <span className="text-md text-gray-400 line-through">${item.product?.price?.toFixed(2)}</span>
                  )}
                  {item.product?.discountPercentage > 0 && (
                    <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded-full font-semibold">-{Math.round(item.product?.discountPercentage)}% OFF</span>
                  )}
                </div>
                <div className="text-gray-600 text-base mt-1">{item.product?.description}</div>
                <div className="flex items-center gap-4 mt-4">
                  <Button
                    variant="ghost"
                    className="rounded-full p-2 border border-lime-400 text-lime-600 hover:bg-lime-100"
                    onClick={() => item.quantity > 1 && updateCartItem(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    title="Decrease quantity"
                    type="button"
                  >
                    <Minus className="w-5 h-5" />
                  </Button>
                  <span className="text-xl font-bold text-[#061f1c] px-4">{item.quantity}</span>
                  <Button
                    variant="ghost"
                    className="rounded-full p-2 border border-lime-400 text-lime-600 hover:bg-lime-100"
                    onClick={() => updateCartItem(item.id, item.quantity + 1)}
                    title="Increase quantity"
                    type="button"
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center gap-8 border border-lime-200">
            <div className="flex-1 flex flex-col gap-4 items-center w-full">
              <div className="text-2xl font-bold text-lime-600 text-center w-full">Order Summary</div>
              <div className="flex flex-col gap-2 w-full">
                <div className="flex justify-between w-full text-lg font-semibold text-[#061f1c]">
                  <span>Total Items:</span>
                  <span>{cartCount}</span>
                </div>
                <div className="flex justify-between w-full text-lg font-semibold text-[#061f1c]">
                  <span>Total:</span>
                  <span className="text-lime-600 font-bold text-xl">${total.toFixed(2)}</span>
                </div>
                {totalDiscount > 0 && (
                  <div className="flex justify-between w-full text-lg font-semibold">
                    <span className="text-[#061f1c]">You saved:</span>
                    <span className="text-red-500 font-bold">${totalDiscount.toFixed(2)}</span>
                  </div>
                )}
              </div>
              <Button
                className="bg-lime-400 hover:bg-lime-300 text-[#061f1c] font-bold px-8 py-3 rounded-full shadow transition-all text-lg w-full mt-6"
                onClick={() => navigate('/checkout')}
                type="button"
              >
                Proceed To Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage; 