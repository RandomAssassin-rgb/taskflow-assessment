const fs = require('fs');
const path = require('path');

const files = {
  'src/pages/Login.tsx': `import React, { useState } from 'react';
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
            {/* Using a placeholder character matching the vibe */}
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
          
          <div className="divider">
            <span>Or Continue With</span>
          </div>
          
          <div className="social-logins">
            <motion.button whileHover={{ y: -2 }} className="social-btn google-btn">G</motion.button>
            <motion.button whileHover={{ y: -2 }} className="social-btn facebook-btn">f</motion.button>
            <motion.button whileHover={{ y: -2 }} className="social-btn apple-btn"></motion.button>
          </div>
          
          <p className="auth-footer">
            Don't have an account? <Link to="/register">Sign Up here</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
`,
  'src/pages/Auth.css': `
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #FCEAE7; /* Soft peach background */
  padding: 1rem;
}

.auth-split-card {
  background: #FFFFFF;
  border-radius: 24px;
  width: 100%;
  max-width: 900px;
  min-height: 600px;
  display: flex;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0,0,0,0.08);
  position: relative;
}

.close-btn {
  position: absolute;
  top: 24px;
  right: 24px;
  background: none;
  border: none;
  color: #67655F;
  cursor: pointer;
  z-index: 10;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background-color: #F4F0E8;
}

.auth-illustration {
  flex: 1.2;
  background-color: #FCEAE7; /* Soft peach */
  position: relative;
  border-radius: 24px;
  margin: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
}

.logo {
  font-size: 1.25rem;
  font-weight: 800;
  color: #D35F57; /* Persimmon */
}

.character-placeholder {
  flex: 1;
  background-image: url('https://illustrations.popsy.co/amber/working-from-home.svg'); /* Using a cute placeholder illustration */
  background-size: contain;
  background-position: center bottom;
  background-repeat: no-repeat;
  margin-top: 20px;
}

.auth-form-side {
  flex: 1;
  padding: 60px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.auth-form-side h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #171716;
  text-align: center;
  margin-bottom: 2rem;
}

.input-group {
  margin-bottom: 1.25rem;
}

.input-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #171716;
  margin-bottom: 0.5rem;
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 16px;
  color: #96928A;
}

.input-with-icon input {
  width: 100%;
  padding: 14px 16px 14px 44px;
  border: 1.5px solid #E5E0D8;
  border-radius: 12px;
  font-size: 1rem;
  color: #171716;
  transition: all 0.2s;
}

.input-with-icon input:focus {
  outline: none;
  border-color: #D35F57;
}

.icon-btn.right {
  position: absolute;
  right: 16px;
  background: none;
  border: none;
  color: #96928A;
  cursor: pointer;
  padding: 4px;
}

.forgot-password {
  text-align: right;
  margin-bottom: 1.5rem;
}

.forgot-password a {
  color: #D35F57;
  font-size: 0.875rem;
  text-decoration: underline;
  font-weight: 600;
}

.btn-login {
  width: 100%;
  background-color: #F87B72; /* Reference salmon pink */
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 2rem 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #E5E0D8;
}

.divider span {
  padding: 0 1rem;
  color: #96928A;
  font-size: 0.875rem;
  font-weight: 500;
}

.social-logins {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.social-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid #E5E0D8;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0,0,0,0.02);
}

.google-btn { color: #DB4437; font-weight: bold; }
.facebook-btn { color: #4267B2; font-weight: bold; }
.apple-btn { color: #000000; font-weight: bold; font-size: 1.5rem; }

.auth-footer {
  text-align: center;
  color: #67655F;
  font-size: 0.875rem;
  font-weight: 500;
}

.auth-footer a {
  color: #171716;
  font-weight: 700;
  text-decoration: underline;
}

.alert-error {
  background-color: #FDE8E1;
  color: #D35F57;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;
}

@media (max-width: 768px) {
  .auth-split-card {
    flex-direction: column;
    min-height: auto;
  }
  .auth-illustration {
    display: none;
  }
  .auth-form-side {
    padding: 40px 24px;
  }
}
`
};

for (const [filepath, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(process.cwd(), filepath), content);
}
console.log("Updated Login Page");
