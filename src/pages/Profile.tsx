
import React from 'react';
import { Card } from '@/components/ui/card';
import { 
  User, 
  Settings,
  CreditCard,
  LogOut,
  ChevronRight
} from 'lucide-react';

interface ProfileItemProps {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
}

const ProfileItem: React.FC<ProfileItemProps> = ({ icon, title, onClick }) => (
  <div 
    className="flex items-center justify-between p-4 hover:bg-secondary rounded-lg cursor-pointer"
    onClick={onClick}
  >
    <div className="flex items-center gap-3">
      {icon}
      <span>{title}</span>
    </div>
    <ChevronRight size={18} className="text-muted-foreground" />
  </div>
);

const Profile = () => {
  const handleItemClick = (item: string) => {
    console.log(`Clicked on ${item}`);
    // Handle navigation or action
  };

  return (
    <div className="pb-16">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      
      <Card className="tr-card mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-16 w-16 rounded-full bg-tr-purple flex items-center justify-center">
            <User size={32} />
          </div>
          <div>
            <h2 className="text-xl font-medium">Trader 435692</h2>
            <p className="text-sm text-muted-foreground">trader435692@example.com</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="tr-card bg-secondary">
            <p className="text-sm text-muted-foreground">Total Invested</p>
            <p className="text-xl font-bold">$10,000.00</p>
          </div>
          <div className="tr-card bg-secondary">
            <p className="text-sm text-muted-foreground">Current Value</p>
            <p className="text-xl font-bold">$10,800.00</p>
          </div>
        </div>
      </Card>
      
      <Card className="tr-card">
        <h3 className="font-medium mb-4">Account</h3>
        
        <div className="flex flex-col">
          <ProfileItem 
            icon={<User size={18} />} 
            title="Personal Information" 
            onClick={() => handleItemClick("Personal Information")} 
          />
          <ProfileItem 
            icon={<CreditCard size={18} />} 
            title="Payment Methods" 
            onClick={() => handleItemClick("Payment Methods")} 
          />
          <ProfileItem 
            icon={<Settings size={18} />} 
            title="Settings" 
            onClick={() => handleItemClick("Settings")} 
          />
          <ProfileItem 
            icon={<LogOut size={18} className="text-tr-red" />} 
            title="Log Out" 
            onClick={() => handleItemClick("Log Out")} 
          />
        </div>
      </Card>
    </div>
  );
};

export default Profile;
