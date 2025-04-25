import { Link } from "react-router-dom";
import Logo from '@/assets/logo.png';
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
<<<<<<< HEAD
        <Link to="/account/settings" className="flex items-center gap-2">
          <img
            src="./assets/user.png"
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          
        </Link>
=======
        <button 
          onClick={handleProfileClick}
          className="rounded-full overflow-hidden hover:opacity-80 transition-opacity focus:ring-2 focus:ring-blue-500 focus:outline-none"
          aria-label="User settings"
          title="User settings"
        >
          <img
            src="./assets/user.png"
            alt="User profile"
            className="w-10 h-10 rounded-full"
          />
        </button>
>>>>>>> 72f398e14925850102148d1bbd68e379b7eed1e3
      </div>
    </header>
  );
};

export default Header;