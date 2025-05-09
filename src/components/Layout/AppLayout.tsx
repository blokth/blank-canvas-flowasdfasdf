
import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from '../Navigation/BottomNav';

const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-tr-dark pb-16">
      <div className="tr-container py-6">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
};

export default AppLayout;
