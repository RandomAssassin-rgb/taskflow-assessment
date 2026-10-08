import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Landing.css';

export const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (heroRef.current) {
        heroRef.current.style.transform = `translateY(${scrollY * 0.4}px)`;
        heroRef.current.style.opacity = `${1 - scrollY / 600}`;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="landing-container">
      <nav className="landing-nav">
        <div className="landing-logo">TaskFlow.</div>
        <div className="landing-actions">
          <button className="nav-btn-login" onClick={() => navigate('/login')}>Log In</button>
          <button className="btn-signup" onClick={() => navigate('/register')}>Get Started</button>
        </div>
      </nav>

      <section className="landing-hero" ref={heroRef}>
        <div className="hero-content">
          <h1 className="hero-title">Organize your work, <br/><span className="highlight">quietly.</span></h1>
          <p className="hero-subtitle">
            TaskFlow is the spatial, editorial workspace designed for deep focus. 
            No clutter. No noise. Just what matters.
          </p>
          <button className="hero-cta" onClick={() => navigate('/register')}>Start for free</button>
        </div>
        
        <div className="hero-visual">
          <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80" alt="Workspace" className="hero-visual-image" loading="lazy" />
          <div className="hero-visual-card card-1">
            <div className="card-header"></div>
            <div className="card-line"></div>
            <div className="card-line short"></div>
          </div>
          <div className="hero-visual-card card-2">
            <div className="card-header"></div>
            <div className="card-line"></div>
            <div className="card-line"></div>
          </div>
        </div>
      </section>

      <section className="landing-features">
        <div className="feature-grid">
          <div className="feature-card">
            <h3>Editorial Design</h3>
            <p>Every pixel is crafted to reduce cognitive load and keep you focused on the content.</p>
          </div>
          <div className="feature-card">
            <h3>Spatial Navigation</h3>
            <p>Move fluidly through your projects and tasks with global command controls.</p>
          </div>
          <div className="feature-card">
            <h3>Real-time Sync</h3>
            <p>Your data stays in sync instantly across web and mobile platforms.</p>
          </div>
        </div>
      </section>
      
      <footer className="landing-footer">
        <p>&copy; {new Date().getFullYear()} TaskFlow. All rights reserved.</p>
      </footer>
    </div>
  );
};
