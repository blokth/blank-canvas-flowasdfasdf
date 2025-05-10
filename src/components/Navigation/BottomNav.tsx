
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home } from 'lucide-react';

interface NavItemProps {
  to: string;
  label: string;
  icon: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({ to, label, icon }) => {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        `tr-bottom-nav-item ${isActive ? 'active' : ''}`
      }
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </NavLink>
  );
};

const BottomNav: React.FC = () => {
  return (
    <nav className="tr-bottom-nav">
      <NavItem to="/" label="Home" icon={<Home size={20} />} />
    </nav>
  );
};

export default BottomNav;
