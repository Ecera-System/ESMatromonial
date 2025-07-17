import React, { useEffect, useState } from "react";
import { ArrowLeft, Check, Zap, Crown, Star, Heart, MessageCircle, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getPlans, createOrder, verifyPayment } from '../../../services/subscriptionService';
import axios from 'axios';

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [userSubscription, setUserSubscription] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getPlans();
        if (Array.isArray(data)) {
          setPlans(data.sort((a, b) => a.price - b.price));
        } else if (data && Array.isArray(data.plans)) {
          setPlans(data.plans.sort((a, b) => a.price - b.price));
        } else {
          setError("Failed to load plans. Please try again later.");
          console.error("Unexpected plans response:", data);
        }
      } catch (err) {
        setError("Failed to load plans. Please try again later.");
        console.error("Fetch plans error:", err);
      } finally {
        setLoading(false);
      }
    };
    
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL.replace('/api/v1', '')}/api/v1/auth/me`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserSubscription(res.data.user.subscription);
      } catch (err) {
        // ignore
      }
    };

    fetchPlans();
    fetchUser();
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
    if (plan.price === 0) {
      navigate('/profile');
      return;
    }

    setProcessingPayment(true);
    try {
      const res = await loadRazorpayScript();
      if (!res) {
        throw new Error("Payment system failed to load");
      }

      const order = await createOrder(plan._id);
      console.log("Order response:", order);
      if (!order || !order.amount || !order.orderId) {
        alert("Failed to initiate payment. Please try again later.");
        setProcessingPayment(false);
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Matrimony Hub",
        description: `${plan.name} Plan Subscription`,
        order_id: order.orderId,
        handler: async function (response) {
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planId: plan._id,
            });
            setShowSuccess(true);
            // Refresh user subscription after payment
            const token = localStorage.getItem('token');
            if (token) {
              const res = await axios.get(
                `${import.meta.env.VITE_API_URL.replace('/api/v1', '')}/api/v1/auth/me`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              setUserSubscription(res.data.user.subscription);
            }
          } catch (err) {
            console.error("Payment verification error:", err);
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: "User Name",
          email: "user@example.com",
        },
        theme: {
          color: "#ec4899",
        },
        modal: {
          ondismiss: () => {
            setProcessingPayment(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment failed. Please try again.");
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white px-4">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 sm:h-12 sm:w-12 bg-pink-200 rounded-full mb-3 sm:mb-4"></div>
          <div className="h-3 w-24 sm:h-4 sm:w-32 bg-pink-200 rounded mb-2"></div>
          <div className="h-3 w-16 sm:h-4 sm:w-24 bg-pink-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50 px-4">
        <div className="text-red-500 text-sm sm:text-base lg:text-lg text-center max-w-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-pink-50 to-white overflow-x-hidden">
      {/* Success Popup - Mobile optimized */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <div className="text-center">
              <div className="mb-4">
                <Check className="w-12 h-12 text-green-500 mx-auto bg-green-100 rounded-full p-3" />
              </div>
              <h2 className="text-xl font-bold text-green-600 mb-2">Payment Successful!</h2>
              <p className="text-gray-700 mb-6 text-sm">Your subscription is now active.</p>
              <button
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                onClick={() => setShowSuccess(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header - Mobile optimized */}
      <header className="w-full px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8">
        <div className="w-full max-w-7xl mx-auto">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-pink-600 hover:text-pink-800 transition-colors py-2 px-1 -ml-1 touch-manipulation"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
            <span className="text-sm sm:text-base font-medium">Back</span>
          </button>
        </div>
      </header>

      {/* User Subscription Details - Mobile optimized */}
      {userSubscription?.isActive && (
        <section className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="w-full max-w-7xl mx-auto text-center">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 inline-block max-w-full">
              <div className="text-green-800">
                <span className="text-sm font-semibold">Current Plan: </span>
                <span className="text-sm font-bold break-words">{userSubscription.planName || 'N/A'}</span>
              </div>
              <div className="text-xs text-green-600 mt-1 space-y-1">
                {userSubscription.activatedAt && (
                  <div>Activated: {new Date(userSubscription.activatedAt).toLocaleDateString()}</div>
                )}
                {userSubscription.expiresAt && (
                  <div>Expires: {new Date(userSubscription.expiresAt).toLocaleDateString()}</div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Hero Section - Mobile optimized */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="w-full max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs sm:text-sm font-medium mb-4">
            <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
            <span>Premium Membership</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight px-2">
            Find Your Perfect Match Faster
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto px-2">
            Unlock powerful features to boost your profile and connect with compatible matches
          </p>
        </div>
      </section>

      {/* Plans Comparison - Mobile optimized */}
      <section className="w-full px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12 lg:pb-16">
        <div className="w-full max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Plan Tiers - Mobile responsive */}
            <div className="w-full p-4 sm:p-6 lg:p-8">
              <div className="w-full space-y-6 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-6 xl:gap-8">
                {plans.map((plan, idx) => {
                  const isCurrent = userSubscription?.plan === plan._id && userSubscription?.isActive;
                  const isPopular = idx === 1;
                  
                  return (
                    <div 
                      key={plan._id} 
                      className={`relative w-full p-4 sm:p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                        isPopular 
                          ? 'bg-gradient-to-b from-pink-50 to-white border-pink-200 shadow-md' 
                          : 'bg-white border-gray-200 hover:border-pink-200'
                      }`}
                    >
                      {/* Popular Badge */}
                      {isPopular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                          <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg whitespace-nowrap">
                            MOST POPULAR
                          </div>
                        </div>
                      )}
                      
                      <div className="flex flex-col h-full w-full">
                        {/* Plan Header */}
                        <div className="text-center mb-6 w-full">
                          <div className="mb-4">
                            {plan.name === 'Premium' ? (
                              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-amber-400 to-amber-500 rounded-xl mx-auto">
                                <Crown className="w-6 h-6 text-white" />
                              </div>
                            ) : plan.name === 'Standard' ? (
                              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl mx-auto">
                                <Star className="w-6 h-6 text-white" />
                              </div>
                            ) : (
                              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-pink-400 to-pink-500 rounded-xl mx-auto">
                                <Heart className="w-6 h-6 text-white" />
                              </div>
                            )}
                          </div>
                          
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 break-words px-2">
                            {plan.name}
                          </h3>
                          
                          <p className="text-sm text-gray-600 mb-4 min-h-[2.5rem] flex items-center justify-center px-2">
                            {plan.description || 'Perfect for getting started'}
                          </p>
                          
                          <div className="mb-4">
                            <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                              ₹{plan.price}
                            </span>
                            {plan.price > 0 && (
                              <span className="text-gray-600 text-sm ml-1">/month</span>
                            )}
                          </div>
                        </div>

                        {/* Features */}
                        <div className="flex-grow mb-6 w-full">
                          <ul className="space-y-3 w-full">
                            {plan.features.map((feature, i) => (
                              <li key={i} className="flex items-start w-full">
                                <div className="flex-shrink-0 mr-3 mt-0.5">
                                  <Check className="w-4 h-4 text-green-500" />
                                </div>
                                <span className="text-sm text-gray-700 leading-relaxed break-words flex-1">
                                  {feature}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* CTA Button or Current Plan */}
                        <div className="mt-auto w-full">
                          {isCurrent ? (
                            <div className="text-center w-full">
                              <div className="bg-green-100 text-green-700 py-3 px-4 rounded-lg font-semibold text-sm mb-2 w-full">
                                ✓ Your Current Plan
                              </div>
                              {userSubscription.expiresAt && (
                                <div className="text-xs text-gray-500 break-words">
                                  Expires: {new Date(userSubscription.expiresAt).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          ) : (
                            <button
                              onClick={() => handleBuyNow(plan)}
                              disabled={processingPayment}
                              className={`w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-300 touch-manipulation ${
                                isPopular 
                                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                                  : 'bg-white border-2 border-pink-500 text-pink-600 hover:bg-pink-50 hover:border-pink-600'
                              } ${processingPayment ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              {processingPayment ? 'Processing...' : (plan.price === 0 ? 'Continue Free' : 'Get Started')}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Mobile optimized */}
      <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6 sm:mb-8 lg:mb-12">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 px-2">
              Success Stories from Our Members
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[
              {
                quote: "Found my life partner within a month of upgrading!",
                name: "Rahul & Priya",
                icon: <Heart className="w-6 h-6 text-pink-500" />
              },
              {
                quote: "The premium features helped me stand out and get noticed.",
                name: "Ananya",
                icon: <Eye className="w-6 h-6 text-blue-500" />
              },
              {
                quote: "Direct messaging made all the difference in our connection.",
                name: "Vikram & Neha",
                icon: <MessageCircle className="w-6 h-6 text-purple-500" />
              }
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white rounded-xl p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                <div className="text-center">
                  <div className="mb-4 flex justify-center">
                    {testimonial.icon}
                  </div>
                  <p className="text-gray-600 italic mb-4 text-sm sm:text-base leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  <p className="font-semibold text-gray-900 text-sm sm:text-base break-words">
                    {testimonial.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ - Mobile optimized */}
      <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6 sm:mb-8 lg:mb-12">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 px-2">
              Frequently Asked Questions
            </h2>
          </div>
          
          <div className="space-y-4 sm:space-y-6">
            {[
              {
                question: "How does billing work?",
                answer: "Your subscription will automatically renew each month. You can cancel anytime from your account settings."
              },
              {
                question: "Can I switch plans later?",
                answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately."
              },
              {
                question: "Is my payment information secure?",
                answer: "Absolutely. We use industry-standard encryption and never store your payment details on our servers."
              }
            ].map((faq, idx) => (
              <div key={idx} className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
                <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-2 sm:mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - Mobile optimized */}
      <section className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-8 sm:py-12 lg:py-16">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-4xl mx-auto text-center">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-4 break-words px-2">
              Ready to Find Your Perfect Match?
            </h2>
            <p className="text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 leading-relaxed break-words px-2">
              Join thousands of happy couples who found love through our platform
            </p>
            <button 
              onClick={() => handleBuyNow(plans.find(p => p.name === 'Premium') || plans[1])}
              disabled={processingPayment}
              className="bg-white text-pink-600 font-semibold py-3 px-6 sm:px-8 rounded-lg hover:bg-gray-100 transition-colors shadow-lg text-sm sm:text-base touch-manipulation"
            >
              {processingPayment ? 'Processing...' : 'Start Your Journey Today'}
            </button>
          </div>
        </div>
      </section>

      {/* Footer - Mobile optimized */}
      <footer className="w-full bg-white py-6 sm:py-8 border-t border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-7xl mx-auto text-center">
            <p className="text-gray-500 text-xs sm:text-sm break-words px-2">
              © {new Date().getFullYear()} Matrimony Hub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Plans;