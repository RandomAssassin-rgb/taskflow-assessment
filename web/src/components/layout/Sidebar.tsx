import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Folder, CheckSquare, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Layout.css';

export const Sidebar: React.FC = () => {
  const { logout } = useAuth();
  
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>TaskFlow</h2>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <LayoutDashboard size={20} />
          <span>Overview</span>
        </NavLink>
        <NavLink to="/projects" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <Folder size={20} />
          <span>Projects</span>
        </NavLink>
        <NavLink to="/tasks" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <CheckSquare size={20} />
          <span>My Tasks</span>
        </NavLink>
      </nav>
      <div className="sidebar-footer">
        <button className="nav-link logout-btn" onClick={logout}>
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
