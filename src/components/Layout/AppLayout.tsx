
import React from 'react';
import { Outlet } from 'react-router-dom';

const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-tr-dark">
      <div className="tr-container py-6">
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
