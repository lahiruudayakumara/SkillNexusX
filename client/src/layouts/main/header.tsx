import { Link } from "react-router-dom";
import Logo from '@/assets/logo.png';
import User from "@/assets/user.png";
import SearchField from "@/components/input-fields/search-fields/serch-field";
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/me/settings');
  };

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md">
      <div className="flex items-center gap-4">
        <div className="logo-container flex items-center gap-2">
          <img src={Logo} alt="Logo" className="w-24" />
        </div>
        <SearchField onChange={() => {}} value="" />
      </div>
      <div className="user-info flex items-center gap-4">
        <button 
          onClick={handleProfileClick}
          className="rounded-full overflow-hidden hover:opacity-80 transition-opacity focus:ring-2 focus:ring-blue-500 focus:outline-none"
          aria-label="User settings"
          title="User settings"
        >
          <img src={User} alt="user" className="w-10 h-10 rounded-full" />
        
        </button>
      </div>
    </header>
  );
};

export default Header;