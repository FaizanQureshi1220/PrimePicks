import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { checkoutAPI, productsAPI } from "../services/api";

const OrderPage = () => {
  const { cart, cartCount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [address, setAddress] = useState(null);
  const [paymentMode, setPaymentMode] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [detailedCart, setDetailedCart] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(true);

  // Detect Stripe success (from successUrl)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("stripe") === "success") {
      setConfirmed(true);
      clearCart();
      return;
    }
    // fallback: check for sessionStorage flag
    if (sessionStorage.getItem("stripe_success")) {
      setConfirmed(true);
      clearCart();
      sessionStorage.removeItem("stripe_success");
      return;
    }
    let addr = null, pay = "";
    if (location.state && location.state.address && location.state.paymentMode) {
      addr = location.state.address;
      pay = location.state.paymentMode;
      sessionStorage.setItem("order_address", JSON.stringify(addr));
      sessionStorage.setItem("order_payment", pay);
    } else {
      try {
        addr = JSON.parse(sessionStorage.getItem("order_address"));
        pay = sessionStorage.getItem("order_payment") || "";
      } catch {}
    }
    setAddress(addr);
    setPaymentMode(pay);
  }, [location, clearCart]);

  // Fetch missing product details if needed
  useEffect(() => {
    const fetchDetails = async () => {
      setLoadingDetails(true);
      const newCart = await Promise.all(
        cart.map(async (item) => {
          if (item.product && item.product.name && item.product.price) {
            return item;
          }
          // Fallback: fetch product details by productId
          try {
            const res = await productsAPI.getProductById(item.productId || item.product?.id);
            return { ...item, product: res.data.data.product };
          } catch {
            return item; // fallback to original if fetch fails
          }
        })
      );
      setDetailedCart(newCart);
      setLoadingDetails(false);
    };
    if (cart && cart.length > 0) {
      fetchDetails();
    } else {
      setDetailedCart([]);
      setLoadingDetails(false);
    }
  }, [cart]);

  const total = detailedCart.reduce((sum, item) => {
    const price = item.product?.price || 0;
    const discount = item.product?.discountPercentage || 0;
    const discountedPrice = price - (price * discount) / 100;
    return sum + discountedPrice * (item.quantity || 1);
  }, 0);

  const handleConfirm = async () => {
    setProcessing(true);
    setError("");
    try {
      // Prepare order data for backend
      const cartItems = detailedCart.map(item => ({
        productId: item.product?.id || item.productId,
        name: item.product?.name,
        image: item.product?.image || item.product?.thumbnail,
        price: item.product?.price,
        discountPercentage: item.product?.discountPercentage,
        quantity: item.quantity,
      }));
      const orderData = {
        cartItems,
        total,
        shippingAddress: address,
        billingAddress: address,
        paymentMethod: paymentMode,
        userId: user?.id,
      };
      const res = await checkoutAPI.processCheckout(orderData);
      if (res.data.success) {
        clearCart();
        setConfirmed(true);
      } else {
        setError(res.data.message || "Order failed. Try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Order failed. Try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (confirmed) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center py-12 px-4" style={{background:'#061f1c'}}>
        <div className="bg-[#f5f5dc] rounded-3xl shadow-2xl p-10 max-w-2xl w-full flex flex-col items-center gap-8">
          <CheckCircle className="w-20 h-20 text-lime-500 mb-2" />
          <div className="text-4xl font-bold text-[#061f1c] text-center">Order Confirmed!</div>
          <button
            className="bg-lime-400 hover:bg-lime-300 text-[#061f1c] font-bold px-8 py-4 rounded-full shadow text-xl transition-all w-full mt-4"
            onClick={() => navigate("/profile")}
          >
            Go to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center py-12 px-4" style={{background:'#061f1c'}}>
      <div className="bg-[#f5f5dc] rounded-3xl shadow-2xl p-10 max-w-2xl w-full flex flex-col gap-10">
        <div>
          <h2 className="text-3xl font-bold text-[#061f1c] mb-6">Order Summary</h2>
          {loadingDetails ? (
            <div className="text-center text-[#061f1c] py-8">Loading product details...</div>
          ) : (
          <div className="flex flex-col gap-4">
            {detailedCart.map((item) => (
              <div key={item.id} className="flex flex-col md:flex-row justify-between items-center bg-white rounded-xl p-4 shadow border border-lime-100 gap-4">
                <img src={item.product?.image || item.product?.thumbnail} alt={item.product?.name} className="w-20 h-20 object-cover rounded-xl border-2 border-lime-200" />
                <div className="flex-1 flex flex-col gap-1">
                  <div className="text-lg font-semibold text-[#061f1c]">{item.product?.name}</div>
                  <div className="text-gray-700">Qty: {item.quantity}</div>
                </div>
                <div className="text-xl font-bold text-lime-600">${((item.product?.price - (item.product?.price * (item.product?.discountPercentage || 0) / 100)) * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>
          )}
          <div className="flex justify-end mt-4 text-xl font-bold text-[#061f1c]">Total: <span className="ml-2 text-lime-600">${total.toFixed(2)}</span></div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#061f1c] mb-4">Shipping Address</h2>
          {address ? (
            <div className="bg-white rounded-xl p-4 shadow border border-lime-100 flex flex-col gap-1">
              <div><span className="font-semibold">Name:</span> {address.name}</div>
              <div><span className="font-semibold">Street:</span> {address.street}</div>
              <div><span className="font-semibold">City:</span> {address.city}</div>
              <div><span className="font-semibold">State:</span> {address.state}</div>
              <div><span className="font-semibold">ZIP:</span> {address.zip}</div>
              <div><span className="font-semibold">Country:</span> {address.country}</div>
            </div>
          ) : <div className="text-gray-500">No address found.</div>}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#061f1c] mb-4">Payment Method</h2>
          <div className="bg-white rounded-xl p-4 shadow border border-lime-100 flex items-center gap-2">
            <span className="font-semibold">{paymentMode === "cod" ? "Cash on Delivery" : paymentMode === "card" ? "Credit Card" : paymentMode === "razorpay" ? "Razorpay" : paymentMode === "stripe" ? "Stripe" : "-"}</span>
          </div>
        </div>
        {error && <div className="text-red-500 text-center font-semibold">{error}</div>}
        <button
          className="bg-lime-400 hover:bg-lime-300 text-[#061f1c] font-bold px-8 py-4 rounded-full shadow text-xl transition-all w-full mt-4"
          onClick={handleConfirm}
          disabled={processing || loadingDetails}
        >
          {processing ? "Processing..." : "Confirm Order"}
        </button>
      </div>
    </div>
  );
};

export default OrderPage; 