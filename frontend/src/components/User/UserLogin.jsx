import React, { useState, useEffect } from 'react';
import { Heart, Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hearts, setHearts] = useState([]);
  const navigate = useNavigate();

  // Your video sources - replace with your actual video paths
  const videos = [
    '/assets/romantic-background.mp4',
    '/assets/romantic-background-2.mp4',
    '/assets/romantic-background-3.mp4'
  ];

  // Heart configurations for different animations
  const heartTypes = [
    { size: 'w-4 h-4', color: 'text-pink-300', opacity: 'opacity-70' },
    { size: 'w-5 h-5', color: 'text-rose-400', opacity: 'opacity-80' },
    { size: 'w-3 h-3', color: 'text-red-300', opacity: 'opacity-60' },
    { size: 'w-6 h-6', color: 'text-pink-400', opacity: 'opacity-90' },
    { size: 'w-4 h-4', color: 'text-purple-300', opacity: 'opacity-70' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideo((prev) => (prev + 1) % videos.length);
    }, 6000);

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
        animationDuration: Math.random() * 8 + 10,
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

    const heartInterval = setInterval(generateHeart, 800);
    
    for (let i = 0; i < 5; i++) {
      setTimeout(generateHeart, i * 200);
    }

    return () => clearInterval(heartInterval);
  }, []);

  const handleInputChange = (e) => {
    setError(''); // Clear error when user types
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted!', formData); // Debug log
    
    // Clear any previous errors
    setError('');
    
    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate login process
      console.log('Starting login process...');
      
      // Call onLogin if provided
      if (onLogin) {
        onLogin(formData);
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Login successful, navigating to dashboard...');
      
      // Navigate to dashboard
      navigate('/dashboard', { replace: true });
      
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Video Background - More Visible */}
      <div className="absolute inset-0 z-0">
        {videos.map((video, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-2000 ease-in-out ${
              index === currentVideo ? 'opacity-70' : 'opacity-0'
            }`}
          >
            <video
              autoPlay
              muted
              loop
              className="w-full h-full object-cover"
              src={video}
            />
          </div>
        ))}
      </div>

      {/* Lighter Gradient Overlay for glassmorphism effect */}
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-slate-900/40 via-purple-900/30 to-indigo-900/40"></div>
      <div className="absolute inset-0 z-11 bg-gradient-to-t from-black/20 via-transparent to-black/10"></div>

      {/* Floating Hearts */}
      <div className="absolute inset-0 z-15 pointer-events-none overflow-hidden">
        {hearts.map((heart) => (
          <div
            key={heart.id}
            className={`absolute ${heart.size} ${heart.color} ${heart.opacity} animate-pulse`}
            style={{
              left: `${heart.x}%`,
              bottom: `${heart.y}%`,
              animation: `
                floatUp ${heart.animationDuration}s linear infinite,
                sway ${heart.animationDuration * 0.7}s ease-in-out infinite,
                heartPulse ${heart.pulseSpeed}s ease-in-out infinite,
                spin ${heart.animationDuration * 2}s linear infinite
              `,
              transform: `scale(${heart.scale}) rotate(${heart.rotation}deg)`,
            }}
          >
            <Heart className="w-full h-full fill-current drop-shadow-lg" />
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
          25% { transform: translateX(20px); }
          75% { transform: translateX(-20px); }
        }
        
        @keyframes heartPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {/* Main Content */}
      <div className="relative z-20 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Glassmorphism Login Card */}
          <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 p-8 shadow-2xl transform transition-all duration-1000 hover:scale-95 hover:shadow-pink-500/20 hover:shadow-2xl hover:bg-white/15">
            {/* Enhanced Glass Border Glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 blur-xl -z-10"></div>
            <div className="absolute inset-0 rounded-3xl border border-white/30 opacity-50"></div>
            
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-pink-500/30 blur-lg animate-pulse"></div>
                  <Heart className="relative w-12 h-12 text-pink-400 fill-pink-400 drop-shadow-lg" />
                  <Sparkles className="w-6 h-6 text-yellow-300 absolute -top-2 -right-2 animate-bounce" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
                HeartConnect
              </h1>
              <p className="text-white/90 text-sm font-medium">
                Find your perfect match, create beautiful memories ✨
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-white/60 group-focus-within:text-pink-400 transition-colors duration-300" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-400/70 focus:border-pink-400/70 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm shadow-inner"
                  placeholder="Enter your email"
                />
              </div>

              {/* Password Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-white/60 group-focus-within:text-pink-400 transition-colors duration-300" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-400/70 focus:border-pink-400/70 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm shadow-inner"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-white/60 hover:text-pink-400 transition-colors duration-300" />
                  ) : (
                    <Eye className="w-5 h-5 text-white/60 hover:text-pink-400 transition-colors duration-300" />
                  )}
                </button>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    className="sr-only"
                  />
                  <div className="w-4 h-4 bg-white/10 border border-white/30 rounded mr-2 flex items-center justify-center group-hover:border-pink-400/50 transition-colors duration-300">
                    <div className="w-2 h-2 bg-pink-400 rounded-sm opacity-0 transition-opacity duration-200"></div>
                  </div>
                  <span className="text-white/90">Remember me</span>
                </label>
                <a href="#" className="text-pink-400 hover:text-pink-300 transition-colors duration-300 font-medium">
                  Forgot password?
                </a>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 mb-4">
                  <p className="text-red-200 text-sm text-center">{error}</p>
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading || !formData.email || !formData.password}
                className="w-full py-4 bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 text-white font-semibold rounded-2xl hover:from-pink-600 hover:via-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-pink-400/50 transform transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl hover:shadow-pink-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                onClick={(e) => {
                  console.log('Login button clicked!'); // Debug log
                  handleSubmit(e);
                }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In to Connect 💕'
                )}
              </button>

              {/* Debug Info (remove in production) */}
              <div className="text-xs text-white/50 text-center mt-2">
                Email: {formData.email} | Password: {'*'.repeat(formData.password.length)}
              </div>
            </form>

            {/* Divider */}
            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/30"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/10 backdrop-blur-sm text-white/80">Or continue with</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <button
                type="button"
                className="py-3 px-4 bg-white/10 border border-white/20 rounded-xl text-white/90 hover:bg-white/20 hover:border-pink-400/50 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg backdrop-blur-sm"
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
                className="py-3 px-4 bg-white/10 border border-white/20 rounded-xl text-white/90 hover:bg-white/20 hover:border-pink-400/50 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg backdrop-blur-sm"
              >
                <svg className="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </button>
            </div>

                        {/* Sign Up Link */}
            <div className="text-center mt-8">
              <p className="text-white/90 text-sm">
                Don't have an account?{' '}
                <button 
                  onClick={() => {
                    console.log('Signup button clicked!');
                    alert('Signup button clicked!');
                    try {
                      navigate('/signup', { replace: true });
                    } catch (error) {
                      console.error('Navigation error:', error);
                      window.location.href = '/signup';
                    }
                  }}
                  className="text-pink-400 hover:text-pink-300 font-semibold transition-colors duration-300 cursor-pointer bg-transparent border-none underline z-50 relative"
                  style={{ pointerEvents: 'auto' }}
                >
                  Sign Up Now
                </button>
              </p>
              {/* Test Navigation Button */}
              
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
                    ? 'bg-pink-400 w-8 shadow-pink-400/50' 
                    : 'bg-white/30 hover:bg-white/50 w-2'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;