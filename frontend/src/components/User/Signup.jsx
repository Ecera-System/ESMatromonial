import React, { useState, useEffect } from 'react';
import { FaHeart } from 'react-icons/fa';
import { Heart, Mail, Lock, User, Phone, Eye, EyeOff, Sparkles, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Signup() {
  const navigate = useNavigate();
  const [currentVideo, setCurrentVideo] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [hearts, setHearts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    terms: false
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    terms: ''
  });

  // Video sources for background rotation
  const videos = [
    
    '/assets/signup-1.mp4',
    '/assets/signup-2.mp4'
  ];

  // Heart configurations for floating animation - Updated colors
  const heartTypes = [
    { size: 'w-4 h-4', color: 'text-coral-300', opacity: 'opacity-75' },
    { size: 'w-5 h-5', color: 'text-rose-400', opacity: 'opacity-85' },
    { size: 'w-3 h-3', color: 'text-amber-300', opacity: 'opacity-65' },
    { size: 'w-6 h-6', color: 'text-emerald-400', opacity: 'opacity-90' },
    { size: 'w-4 h-4', color: 'text-teal-300', opacity: 'opacity-70' },
    { size: 'w-5 h-5', color: 'text-orange-300', opacity: 'opacity-80' },
  ];

  // Video rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideo((prev) => (prev + 1) % videos.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [videos.length]);

  // Generate floating hearts
  useEffect(() => {
    const generateHeart = () => {
      const heartType = heartTypes[Math.floor(Math.random() * heartTypes.length)];
      const newHeart = {
        id: Date.now() + Math.random(),
        x: Math.random() * 100,
        y: 110,
        ...heartType,
        animationDuration: Math.random() * 8 + 12,
        swayAmount: Math.random() * 30 + 10,
        rotation: Math.random() * 360,
        scale: Math.random() * 0.5 + 0.8,
        pulseSpeed: Math.random() * 2 + 1,
      };
      
      setHearts(prev => [...prev, newHeart]);

      setTimeout(() => {
        setHearts(prev => prev.filter(heart => heart.id !== newHeart.id));
      }, newHeart.animationDuration * 1000);
    };

    const heartInterval = setInterval(generateHeart, 600);
    
    for (let i = 0; i < 7; i++) {
      setTimeout(generateHeart, i * 150);
    }

    return () => clearInterval(heartInterval);
  }, []);

  const validatePhone = (phone) => {
    const regex = /^\d{10}$/;
    return regex.test(phone);
  };

  const validatePassword = (password) => {
    const hasMinLength = password.length >= 8;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasCapitalLetter = /[A-Z]/.test(password);
    
    return {
      valid: hasMinLength && hasSpecialChar && hasCapitalLetter,
      messages: [
        !hasMinLength && 'Minimum 8 characters',
        !hasSpecialChar && 'At least 1 special character',
        !hasCapitalLetter && '1 capital letter'
      ].filter(Boolean)
    };
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let valid = true;
    const newErrors = { ...errors };

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
      valid = false;
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Phone must be 10 digits';
      valid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
      valid = false;
    } else {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.valid) {
        newErrors.password = passwordValidation.messages.join(', ');
        valid = false;
      }
    }

    if (!formData.terms) {
      newErrors.terms = 'You must agree to the terms';
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      console.log('Form submitted:', formData);
      alert('Account created successfully!');
    }
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-emerald-950 to-orange-950">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        {videos.map((video, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-2000 ease-in-out ${
              index === currentVideo ? 'opacity-75' : 'opacity-0'
            }`}
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
              src={video}
            />
          </div>
        ))}
      </div>

      {/* Enhanced Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-slate-900/45 via-emerald-900/35 to-orange-900/45"></div>
      <div className="absolute inset-0 z-11 bg-gradient-to-t from-black/25 via-transparent to-teal-900/15"></div>
      <div className="absolute inset-0 z-12 bg-gradient-to-r from-coral-900/10 via-transparent to-amber-900/10"></div>

      {/* Floating Hearts */}
      <div className="absolute inset-0 z-15 pointer-events-none overflow-hidden">
        {hearts.map((heart) => (
          <div
            key={heart.id}
            className={`absolute ${heart.size} ${heart.color} ${heart.opacity}`}
            style={{
              left: `${heart.x}%`,
              bottom: `${heart.y}%`,
              animation: `
                floatUp ${heart.animationDuration}s linear infinite,
                sway ${heart.animationDuration * 0.7}s ease-in-out infinite,
                heartPulse ${heart.pulseSpeed}s ease-in-out infinite,
                spin ${heart.animationDuration * 1.5}s linear infinite
              `,
              transform: `scale(${heart.scale}) rotate(${heart.rotation}deg)`,
            }}
          >
            <Heart className="w-full h-full fill-current drop-shadow-lg filter drop-shadow-[0_0_8px_rgba(255,165,0,0.3)]" />
          </div>
        ))}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes floatUp {
          0% { transform: translateY(0px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 0.8; }
          100% { transform: translateY(-100vh); opacity: 0; }
        }
        
        @keyframes sway {
          0%, 100% { transform: translateX(0px); }
          25% { transform: translateX(25px); }
          75% { transform: translateX(-25px); }
        }
        
        @keyframes heartPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.3); }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {/* Main Content */}
      <div className="relative z-20 flex items-center justify-center min-h-screen p-4 py-8">
        <div className="w-full max-w-lg">
          {/* Glassmorphism Signup Card with new colors */}
          <div className="relative bg-white/12 backdrop-blur-3xl rounded-3xl border border-amber-200/25 p-8 shadow-2xl transform transition-all duration-1000 hover:scale-85 hover:shadow-orange-500/25 hover:shadow-2xl hover:bg-white/18">
            {/* Enhanced Glass Border Glow with new colors */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-coral-500/15 via-amber-500/12 to-teal-500/15 blur-xl -z-10"></div>
            <div className="absolute inset-0 rounded-3xl border border-gradient-to-r from-orange-300/40 via-rose-300/30 to-emerald-300/40 opacity-60"></div>
            
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-coral-500/40 to-amber-500/40 blur-lg animate-pulse"></div>
                  <FaHeart className="relative w-12 h-12 text-transparent bg-gradient-to-r from-coral-400 via-amber-400 to-teal-400 bg-clip-text drop-shadow-lg" />
                  <Sparkles className="w-6 h-6 text-amber-300 absolute -top-2 -right-2 animate-bounce filter drop-shadow-[0_0_4px_rgba(255,191,0,0.6)]" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-coral-400 via-amber-400 to-teal-400 bg-clip-text text-transparent drop-shadow-lg">
                Join HeartConnect
              </h1>
              <p className="text-amber-100/95 text-sm font-medium">
                Get ready to connect & find your soulmate ✨💫
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-amber-200/70 group-focus-within:text-coral-400 transition-colors duration-300" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className={`w-full pl-12 pr-4 py-4 bg-white/12 border rounded-2xl text-white placeholder-amber-200/70 focus:outline-none focus:ring-2 focus:ring-coral-400/70 focus:border-coral-400/70 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm shadow-inner ${
                    errors.name ? 'border-red-400/70 ring-1 ring-red-400/50' : 'border-amber-200/25'
                  }`}
                />
                {errors.name && (
                  <div className="flex items-center mt-2 text-red-300 text-sm">
                    <span className="text-xs">⚠️</span>
                    <span className="ml-1">{errors.name}</span>
                  </div>
                )}
              </div>
              
              {/* Email Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-amber-200/70 group-focus-within:text-coral-400 transition-colors duration-300" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className={`w-full pl-12 pr-4 py-4 bg-white/12 border rounded-2xl text-white placeholder-amber-200/70 focus:outline-none focus:ring-2 focus:ring-coral-400/70 focus:border-coral-400/70 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm shadow-inner ${
                    errors.email ? 'border-red-400/70 ring-1 ring-red-400/50' : 'border-amber-200/25'
                  }`}
                />
                {errors.email && (
                  <div className="flex items-center mt-2 text-red-300 text-sm">
                    <span className="text-xs">⚠️</span>
                    <span className="ml-1">{errors.email}</span>
                  </div>
                )}
              </div>

              {/* Phone Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="w-5 h-5 text-amber-200/70 group-focus-within:text-coral-400 transition-colors duration-300" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className={`w-full pl-12 pr-4 py-4 bg-white/12 border rounded-2xl text-white placeholder-amber-200/70 focus:outline-none focus:ring-2 focus:ring-coral-400/70 focus:border-coral-400/70 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm shadow-inner ${
                    errors.phone ? 'border-red-400/70 ring-1 ring-red-400/50' : 'border-amber-200/25'
                  }`}
                />
                {errors.phone && (
                  <div className="flex items-center mt-2 text-red-300 text-sm">
                    <span className="text-xs">⚠️</span>
                    <span className="ml-1">{errors.phone}</span>
                  </div>
                )}
              </div>
              
              {/* Password Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-amber-200/70 group-focus-within:text-coral-400 transition-colors duration-300" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create Password"
                  className={`w-full pl-12 pr-12 py-4 bg-white/12 border rounded-2xl text-white placeholder-amber-200/70 focus:outline-none focus:ring-2 focus:ring-coral-400/70 focus:border-coral-400/70 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm shadow-inner ${
                    errors.password ? 'border-red-400/70 ring-1 ring-red-400/50' : 'border-amber-200/25'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-amber-200/70 hover:text-coral-400 transition-colors duration-300" />
                  ) : (
                    <Eye className="w-5 h-5 text-amber-200/70 hover:text-coral-400 transition-colors duration-300" />
                  )}
                </button>
                {errors.password && (
                  <div className="flex items-center mt-2 text-red-300 text-sm">
                    <span className="text-xs">⚠️</span>
                    <span className="ml-1">{errors.password}</span>
                  </div>
                )}
              </div>
              
              {/* Terms Checkbox */}
              <div className="flex items-start space-x-3 group">
                <div className="relative flex items-center justify-center mt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    name="terms"
                    checked={formData.terms}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 border-2 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300 ${
                    formData.terms 
                      ? 'bg-gradient-to-r from-coral-500 via-amber-500 to-teal-500 border-coral-400 shadow-lg shadow-coral-500/30' 
                      : errors.terms 
                        ? 'border-red-400/70 bg-red-500/10' 
                        : 'border-amber-200/40 bg-white/10 hover:border-coral-400/60 hover:shadow-sm hover:shadow-coral-400/20'
                  }`} onClick={() => setFormData({...formData, terms: !formData.terms})}>
                    {formData.terms && (
                      <CheckCircle className="w-3 h-3 text-white drop-shadow-sm" />
                    )}
                  </div>
                </div>
                <label htmlFor="terms" className="text-amber-100/95 text-sm leading-relaxed cursor-pointer">
                  I read and agree to the{' '}
                  <span className="text-coral-400 hover:text-coral-300 font-medium transition-colors duration-300">Terms & Conditions</span> and{' '}
                  <span className="text-teal-400 hover:text-teal-300 font-medium transition-colors duration-300">Privacy Policy</span>
                </label>
              </div>
              {errors.terms && (
                <div className="flex items-center text-red-300 text-sm">
                  <span className="text-xs">⚠️</span>
                  <span className="ml-1">{errors.terms}</span>
                </div>
              )}
              
              {/* Submit Button */}
              <button 
                type="submit" 
                className="w-full py-4 bg-gradient-to-r from-coral-500 via-amber-500 to-teal-500 text-white font-semibold cursor-pointer rounded-2xl hover:from-coral-600 hover:via-amber-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-coral-400/50 transform transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl hover:shadow-coral-500/30 mt-6"
              >
                CREATE ACCOUNT 💕✨
              </button>
            </form>

            {/* Divider */}
            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-amber-200/30"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/12 backdrop-blur-sm text-amber-100/90">Or sign up with</span>
              </div>
            </div>

            {/* Social Signup */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <button
                type="button"
                className="py-3 px-4 bg-white/12 border border-amber-200/25 rounded-xl text-amber-100/95 hover:bg-white/20 hover:border-coral-400/60 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg backdrop-blur-sm hover:shadow-coral-400/20"
              >
                <svg className="w-5 h-5 mx-auto" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </button>
              <button
                type="button"
                className="py-3 px-4 bg-white/12 border border-amber-200/25 rounded-xl text-amber-100/95 hover:bg-white/20 hover:border-teal-400/60 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg backdrop-blur-sm hover:shadow-teal-400/20"
              >
                <svg className="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center mt-8">
              <p className="text-amber-100/95 text-sm">
                Already have an account?{' '}
                <button 
                  onClick={() => {
                    console.log('Login button clicked!');
                    alert('Login button clicked!');
                    try {
                      navigate('/login', { replace: true });
                    } catch (error) {
                      console.error('Navigation error:', error);
                      window.location.href = '/login';
                    }
                  }}
                  className="text-coral-400 hover:text-coral-300 font-medium transition-colors duration-300 cursor-pointer bg-transparent border-none underline z-50 relative"
                  style={{ pointerEvents: 'auto' }}
                >
                  Sign in here
                </button>
              </p>
            </div>
          </div>

          {/* Video Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {videos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentVideo(index)}
                className={`h-2 rounded-full transition-all duration-300 shadow-lg ${
                  index === currentVideo 
                    ? 'bg-gradient-to-r from-coral-400 to-amber-400 w-8 shadow-coral-400/50' 
                    : 'bg-amber-200/40 hover:bg-amber-200/60 w-2'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;