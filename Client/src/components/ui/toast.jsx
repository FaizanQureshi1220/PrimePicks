import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ message: "", visible: false });

  const showToast = useCallback((message, duration = 2500) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: "", visible: false }), duration);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {toast.visible && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-lime-500 text-white px-6 py-3 rounded-xl shadow-lg text-lg font-semibold animate-fade-in-out transition-all">
            {toast.message}
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

// Add a simple fade-in-out animation
// In your global CSS (e.g., index.css), add:
// @keyframes fade-in-out {
//   0% { opacity: 0; transform: translateY(-20px); }
//   10% { opacity: 1; transform: translateY(0); }
//   90% { opacity: 1; transform: translateY(0); }
//   100% { opacity: 0; transform: translateY(-20px); }
// }
// .animate-fade-in-out { animation: fade-in-out 2.5s both; } 