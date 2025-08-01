import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Home, Truck, DollarSign, CreditCard as CardIcon, Wallet, Banknote } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";

const paymentOptions = [
  { value: "cod", label: "Cash on Delivery", icon: <Truck className="w-6 h-6 mr-2 text-lime-600" /> },
  { value: "card", label: "Credit Card", icon: <CardIcon className="w-6 h-6 mr-2 text-lime-600" /> },
  { value: "razorpay", label: "Razorpay", icon: <Wallet className="w-6 h-6 mr-2 text-lime-600" /> },
  { value: "stripe", label: "Stripe", icon: <Banknote className="w-6 h-6 mr-2 text-lime-600" /> },
];

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe("pk_test_51PoqjnGuEC1xy5H1NVDfvv7Y4hPmWiuPCXyiJtY0kAzM2tSHpNCG0IECcZ4nVo8X6SXAXzftxAnI1liDJwukhRH200WQ5zLxBh");

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [address, setAddress] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });
  const [paymentMode, setPaymentMode] = useState("");
  const [card, setCard] = useState({
    holder: "",
    number: "",
    expiry: "",
    cvv: "",
  });
  const [processing, setProcessing] = useState(false);

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };
  const handleCardChange = (e) => {
    setCard({ ...card, [e.target.name]: e.target.value });
  };

  const handleProceed = async (e) => {
    e.preventDefault();
    setProcessing(true);
    sessionStorage.setItem("order_address", JSON.stringify(address));
    sessionStorage.setItem("order_payment", paymentMode);

    if (paymentMode === "stripe") {
      try {
        // TODO: Replace with your actual cart data
        const cartItems = [
          { productId: 1, name: "Sample Product", price: 100, quantity: 1 }
        ];
        // Set a flag so OrderPage can detect Stripe return
        sessionStorage.setItem("stripe_success", "pending");
        const response = await fetch("http://localhost:3000/api/payment/create-checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cartItems,
            successUrl: window.location.origin + "/order?stripe=success",
            cancelUrl: window.location.origin + "/checkout"
          })
        });
        const data = await response.json();
        if (data.success && data.url) {
          window.location.href = data.url;
        } else {
          alert("Stripe session creation failed: " + (data.message || "Unknown error"));
          setProcessing(false);
        }
      } catch (err) {
        alert("Stripe error: " + err.message);
        setProcessing(false);
      }
    } else {
      setTimeout(() => {
        setProcessing(false);
        navigate("/order", { state: { address, paymentMode } });
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center py-12 px-4" style={{background:'#061f1c'}}>
      <form onSubmit={handleProceed} className="bg-[#f5f5dc] rounded-3xl shadow-2xl p-10 max-w-2xl w-full flex flex-col gap-10">
        <div>
          <h2 className="text-3xl font-bold text-[#061f1c] mb-6 flex items-center"><Home className="w-8 h-8 mr-2 text-lime-600" />Shipping Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="name" value={address.name} onChange={handleAddressChange} required placeholder="Full Name" className="p-3 rounded-lg border border-lime-200 focus:border-lime-400 outline-none bg-white" />
            <input name="street" value={address.street} onChange={handleAddressChange} required placeholder="Street Address" className="p-3 rounded-lg border border-lime-200 focus:border-lime-400 outline-none bg-white md:col-span-2" />
            <input name="city" value={address.city} onChange={handleAddressChange} required placeholder="City" className="p-3 rounded-lg border border-lime-200 focus:border-lime-400 outline-none bg-white" />
            <input name="state" value={address.state} onChange={handleAddressChange} required placeholder="State" className="p-3 rounded-lg border border-lime-200 focus:border-lime-400 outline-none bg-white" />
            <input name="zip" value={address.zip} onChange={handleAddressChange} required placeholder="ZIP Code" className="p-3 rounded-lg border border-lime-200 focus:border-lime-400 outline-none bg-white" />
            <input name="country" value={address.country} onChange={handleAddressChange} required placeholder="Country" className="p-3 rounded-lg border border-lime-200 focus:border-lime-400 outline-none bg-white" />
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-[#061f1c] mb-6 flex items-center"><DollarSign className="w-8 h-8 mr-2 text-lime-600" />Payment Method</h2>
          <div className="flex flex-col gap-4">
            {paymentOptions.map(opt => (
              <label key={opt.value} className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMode === opt.value ? 'border-lime-400 bg-lime-50' : 'border-lime-200 bg-white'}`}> 
                <input
                  type="radio"
                  name="paymentMode"
                  value={opt.value}
                  checked={paymentMode === opt.value}
                  onChange={() => setPaymentMode(opt.value)}
                  className="mr-3 accent-lime-400"
                  required
                />
                {opt.icon}
                <span className="text-lg font-semibold text-[#061f1c]">{opt.label}</span>
              </label>
            ))}
          </div>
          {paymentMode === "card" && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-xl border border-lime-200">
              <input name="holder" value={card.holder} onChange={handleCardChange} required placeholder="Card Holder Name" className="p-3 rounded-lg border border-lime-200 focus:border-lime-400 outline-none bg-white md:col-span-2" />
              <input name="number" value={card.number} onChange={handleCardChange} required placeholder="Card Number" className="p-3 rounded-lg border border-lime-200 focus:border-lime-400 outline-none bg-white md:col-span-2" />
              <input name="expiry" value={card.expiry} onChange={handleCardChange} required placeholder="Expiry (MM/YY)" className="p-3 rounded-lg border border-lime-200 focus:border-lime-400 outline-none bg-white" />
              <input name="cvv" value={card.cvv} onChange={handleCardChange} required placeholder="CVV" className="p-3 rounded-lg border border-lime-200 focus:border-lime-400 outline-none bg-white" />
            </div>
          )}
          {(paymentMode === "razorpay" || paymentMode === "stripe") && (
            <div className="mt-6 bg-white p-6 rounded-xl border border-lime-200 flex flex-col items-center gap-2">
              <span className="text-lg text-[#061f1c] font-semibold">{paymentMode === "razorpay" ? "Razorpay" : "Stripe"} Payment</span>
              <span className="text-gray-500">{paymentMode === "razorpay" ? "(Payment gateway integration coming soon)" : "You will be redirected to Stripe Checkout to complete your payment."}</span>
            </div>
          )}
        </div>
        <button
          type="submit"
          className="bg-lime-400 hover:bg-lime-300 text-[#061f1c] font-bold px-8 py-4 rounded-full shadow text-xl transition-all w-full mt-4"
          disabled={processing}
        >
          {processing ? "Processing..." : "Proceed"}
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage; 