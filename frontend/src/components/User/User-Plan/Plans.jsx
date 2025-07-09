import React, { useEffect, useState } from "react";
import axios from "axios";
import BackButton from "../../BackButton";

const Plans = () => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/subscription/plans")
      .then((res) => setPlans(res.data))
      .catch((err) => console.error("Error fetching plans", err));
  }, []);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleBuyNow = async (plan) => {
    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    try {
      const { data } = await axios.post("http://localhost:5000/api/subscription/create-order", {
        amount: plan.price,
        planId: plan._id,
      });

      const options = {
        key: "rzp_test_wPD59LVBMG0lMQ",
        amount: data.amount,
        currency: "INR",
        name: "Matrimony Hub",
        description: plan.name + " Plan",
        order_id: data.orderId,
        handler: function (response) {
          alert("Payment successful!");
        },
        prefill: {
          name: "Test User",
          email: "test@example.com",
        },
        theme: {
          color: "#ec4899",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
    }
  };

  return (
    <div className="bg-pink-50 font-sans min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-md py-4">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-pink-500 text-2xl">💍</span>
            <h1 className="text-pink-600 text-xl font-extrabold tracking-wide">Matrimony Hub</h1>
          </div>
          <nav className="space-x-6">
            <a href="/" className="text-gray-600 hover:text-pink-600 font-medium transition">Home</a>
            <a href="/plans" className="text-pink-600 font-semibold border-b-2 border-pink-600">Plans</a>
            <a href="/login" className="text-gray-600 hover:text-pink-600 font-medium transition">Login</a>
            <a href="/register" className="text-gray-600 hover:text-pink-600 font-medium transition">Register</a>
          </nav>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <BackButton />
        </div>
      </div>

      {/* Intro */}
      <section className="text-center my-12">
        <h2 className="text-2xl text-pink-800 font-bold">Choose the Plan That Suits You</h2>
        <p className="text-gray-500 mt-2">Unlock premium features like direct messaging and profile boost</p>
      </section>

      {/* Plans */}
      <section className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {plans.map((plan, idx) => (
          <div key={idx} className="bg-white border border-pink-200 rounded-2xl p-6 shadow-md text-center">
            <h3 className="text-pink-600 text-xl font-semibold">{plan.name}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">₹{plan.price}</p>
            <ul className="mt-4 text-gray-600 space-y-2">
              {plan.features.map((f, i) => (
                <li key={i}>✅ {f}</li>
              ))}
            </ul>
            <button
              className="mt-6 w-full bg-pink-200 text-pink-600 font-semibold py-2 rounded-xl hover:bg-pink-300"
              onClick={() => handleBuyNow(plan)}
            >
              {plan.price === 0 ? "Get Started" : "Buy Now"}
            </button>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="mt-12 py-6 text-center text-sm text-gray-500 border-t border-gray-200">
        © 2025 Matrimony Hub. All rights reserved.
      </footer>
    </div>
  );
};

export default Plans;
