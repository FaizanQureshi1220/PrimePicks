import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { checkoutAPI } from "../services/api";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { user, loading, fetchUserProfile, logout, updateAddress } = useAuth();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const navigate = useNavigate();
  const [editingAddress, setEditingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState(user?.address || {
    name: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: ""
  });
  const [addressSaving, setAddressSaving] = useState(false);
  const [addressError, setAddressError] = useState("");

  useEffect(() => {
    // Only fetch user profile on mount
    fetchUserProfile && fetchUserProfile();
    // eslint-disable-next-line
  }, []);

  // When user changes, update address form and fetch orders
  useEffect(() => {
    // Log user id for debugging
    if (user && user.id) {
      console.log('[ProfilePage] user.id:', user.id);
    }
    setAddressForm(user?.address || {
      name: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      country: ""
    });
    if (user && user.id) {
      setOrdersLoading(true);
      checkoutAPI.getUserOrders(user.id)
        .then(res => {
          console.log('[ProfilePage] getUserOrders response:', res);
          setOrders(res.data.data.orders || []);
        })
        .catch(() => setOrders([]))
        .finally(() => setOrdersLoading(false));
    }
    // eslint-disable-next-line
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleAddressChange = (e) => {
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
  };

  const handleAddressSave = async (e) => {
    e.preventDefault();
    setAddressSaving(true);
    setAddressError("");
    const result = await updateAddress(addressForm);
    if (result.success) {
      setEditingAddress(false);
    } else {
      setAddressError(result.error);
    }
    setAddressSaving(false);
  };

  if (loading)
    return <div className="flex justify-center items-center h-64 text-white" style={{background:'#061f1c'}}>Loading profile...</div>;

  return (
    <div className="min-h-screen w-full py-12 px-4" style={{background:'#061f1c'}}>
      <div className="max-w-2xl mx-auto bg-[#f5f5dc] rounded-3xl shadow-2xl p-8 flex flex-col gap-8">
        <div className="flex flex-col items-center gap-4">
          <div className="w-24 h-24 rounded-full bg-lime-400 flex items-center justify-center text-4xl font-bold text-[#061f1c] shadow-lg">
            {user?.name?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || "U"}
          </div>
          <h1 className="text-3xl font-bold text-[#061f1c]">{user?.name || user?.username}</h1>
          <div className="text-lg text-gray-700">{user?.email}</div>
          <div className="w-full flex flex-col items-center mt-2">
            <h3 className="text-lg font-semibold text-[#061f1c] mb-1">Address</h3>
            {editingAddress ? (
              <form className="w-full max-w-md flex flex-col gap-2" onSubmit={handleAddressSave}>
                <input className="border rounded p-2" name="name" placeholder="Full Name" value={addressForm.name} onChange={handleAddressChange} required />
                <input className="border rounded p-2" name="street" placeholder="Street" value={addressForm.street} onChange={handleAddressChange} required />
                <input className="border rounded p-2" name="city" placeholder="City" value={addressForm.city} onChange={handleAddressChange} required />
                <input className="border rounded p-2" name="state" placeholder="State" value={addressForm.state} onChange={handleAddressChange} required />
                <input className="border rounded p-2" name="zip" placeholder="ZIP" value={addressForm.zip} onChange={handleAddressChange} required />
                <input className="border rounded p-2" name="country" placeholder="Country" value={addressForm.country} onChange={handleAddressChange} required />
                {addressError && <div className="text-red-500 text-sm">{addressError}</div>}
                <div className="flex gap-2 mt-2">
                  <button type="submit" className="bg-lime-400 hover:bg-lime-300 text-[#061f1c] font-bold px-4 py-2 rounded shadow" disabled={addressSaving}>{addressSaving ? "Saving..." : "Save"}</button>
                  <button type="button" className="bg-gray-300 hover:bg-gray-200 text-[#061f1c] font-bold px-4 py-2 rounded shadow" onClick={() => setEditingAddress(false)} disabled={addressSaving}>Cancel</button>
                </div>
              </form>
            ) : user?.address ? (
              <div className="bg-white rounded-xl p-4 shadow border border-lime-100 w-full max-w-md flex flex-col gap-1 text-left">
                <div><span className="font-semibold">Name:</span> {user.address.name}</div>
                <div><span className="font-semibold">Street:</span> {user.address.street}</div>
                <div><span className="font-semibold">City:</span> {user.address.city}</div>
                <div><span className="font-semibold">State:</span> {user.address.state}</div>
                <div><span className="font-semibold">ZIP:</span> {user.address.zip}</div>
                <div><span className="font-semibold">Country:</span> {user.address.country}</div>
                <button className="mt-2 bg-lime-400 hover:bg-lime-300 text-[#061f1c] font-bold px-4 py-2 rounded shadow w-fit" onClick={() => setEditingAddress(true)}>Edit Address</button>
              </div>
            ) : (
              <div className="text-gray-500">No address found. <button className="ml-2 underline text-lime-600" onClick={() => setEditingAddress(true)}>Add Address</button></div>
            )}
          </div>
        </div>
        <button onClick={handleLogout} className="bg-lime-400 hover:bg-lime-300 text-[#061f1c] font-bold px-8 py-3 rounded-full shadow transition-all w-full">Logout</button>
        <div>
          <h2 className="text-2xl font-bold text-[#061f1c] mb-4">Previous Orders</h2>
          {ordersLoading ? (
            <div className="text-gray-600">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-gray-500">No previous orders found.</div>
          ) : (
            <ul className="space-y-4">
              {orders.map((order) => (
                <li key={order.id} className="bg-white rounded-xl p-4 shadow flex flex-col gap-2">
                  <div className="font-semibold text-[#061f1c]">Order #{order.id}</div>
                  <div className="text-gray-700">Total: ${order.total?.toFixed(2)}</div>
                  <div className="text-gray-500 text-sm">{new Date(order.createdAt).toLocaleString()}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 