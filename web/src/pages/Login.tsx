import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, X } from 'lucide-react';
import './Auth.css';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      login(res.data.token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <motion.div 
        className="auth-split-card"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <button className="close-btn"><X size={24} /></button>
        
        <div className="auth-illustration">
          <div className="logo">TaskFlow.</div>
          <div className="illustration-image">
            {}
            <div className="character-placeholder" />
          </div>
        </div>
        
        <div className="auth-form-side">
          <h2>Login</h2>
          
          {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="alert-error">{error}</motion.div>}
          
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email</label>
              <div className="input-with-icon">
                <Mail className="input-icon" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>
            
            <div className="input-group">
              <label>Password</label>
              <div className="input-with-icon">
                <Lock className="input-icon" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button type="button" className="icon-btn right" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <div className="forgot-password">
              <Link to="#">Forgot Password?</Link>
            </div>
            
            <motion.button 
              type="submit" 
              className="btn-login"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </motion.button>
          </form>
          

          
          <p className="auth-footer">
            Don't have an account? <Link to="/register">Sign Up here</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
