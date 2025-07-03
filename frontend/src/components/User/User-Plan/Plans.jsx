import React from "react";
const Plans = () => {
  return (
    <div className="bg-pink-50 font-sans min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-md py-4">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-pink-600 text-xl font-bold">Matrimony Hub</h1>
          <nav className="space-x-4">
            <a href="#" className="text-pink-600 font-medium hover:underline">Home</a>
            <a href="#" className="text-pink-600 font-medium hover:underline">Login</a>
            <a href="#" className="text-pink-600 font-medium hover:underline">Register</a>
          </nav>
        </div>
      </header>
      {/* Intro */}
      <section className="text-center my-12">
        <h2 className="text-2xl text-pink-800 font-bold">Choose the Plan That Suits You</h2>
        <p className="text-gray-500 mt-2">Unlock premium features like direct messaging and profile boost</p>
      </section>
      {/* Plans */}
      <section className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {[
          {
            name: "Basic",
            price: "₹0",
            features: [" ✅ View 10 profiles/day", " ✅ Limited filters", " ✅ Basic support"],
          },
          {
            name: "Premium",
            price: "₹499/month",
            features: [" ✅ Unlimited profile views", " ✅ Contact 10 profiles/month", " ✅ Priority support"],
          },
          {
            name: "Elite VIP",
            price: "₹999/month",
            features: [" ✅ Direct chat with members", " ✅ Profile boost & highlights", " ✅ Match priority algorithm"],
          },
        ].map((plan, idx) => (
          <div key={idx} className="bg-white border border-pink-200 rounded-2xl p-6 shadow-md text-center">
            <h3 className="text-pink-600 text-xl font-semibold">{plan.name}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">{plan.price}</p>
            <ul className="mt-4 text-gray-600 space-y-2">
              {plan.features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
            <button className="mt-6 w-full bg-pink-200 text-pink-600 font-semibold py-2 rounded-xl hover:bg-pink-300">
              {plan.name === "Basic" ? "Get Started" : "Buy Now"}
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






