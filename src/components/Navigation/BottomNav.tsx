
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home,
  Search,
  BarChart2,
  User
} from 'lucide-react';

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
      <NavItem to="/stocks" label="Stocks" icon={<Search size={20} />} />
      <NavItem to="/stock/aapl" label="Detail" icon={<BarChart2 size={20} />} />
      <NavItem to="/profile" label="Profile" icon={<User size={20} />} />
    </nav>
  );
};

export default BottomNav;
