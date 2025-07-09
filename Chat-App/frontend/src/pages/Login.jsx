import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/Chat/AuthContext';
import { Heart, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      toast.success('Welcome back!');
      navigate('/chat');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="auth-page">
      {/* Floating particles */}
      <div className="particles">
        {[...Array(30)].map((_, i) => (
          <div 
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${20 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="max-w-md w-full mx-4 relative z-10"
      >
        <div className="backdrop-blur-2xl bg-white/10 rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Enhanced Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />
              <Heart className="w-10 h-10 text-white relative z-10" />
            </motion.div>
            <h2 className="text-4xl font-bold text-white mb-3">Welcome Back</h2>
            <p className="text-white/70 text-lg">Sign in to continue your journey</p>
          </div>

          {/* Enhanced Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email field with enhanced styling */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-semibold text-white/90 mb-3">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-sm"></div>
                <div className="relative bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 overflow-hidden">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-transparent text-white placeholder-white/50 font-medium outline-none"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
            </motion.div>

            {/* Password field with enhanced styling */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-sm font-semibold text-white/90 mb-3">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-sm"></div>
                <div className="relative bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 overflow-hidden">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-14 py-4 bg-transparent text-white placeholder-white/50 font-medium outline-none"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Enhanced submit button */}
            <motion.button
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              type="submit"
              disabled={loading}
              className="w-full btn-glow text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-6 border-2 border-transparent border-t-white rounded-full mr-3"
                  />
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          {/* Enhanced Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center mt-8"
          >
            <p className="text-white/70">
              Don't have an account?{' '}
              <Link to="/register" className="text-pink-300 hover:text-pink-200 font-bold">
                Sign Up
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
