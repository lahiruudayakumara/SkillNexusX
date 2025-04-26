import { useState, useRef, useEffect } from 'react';
import Logo from '@/assets/logo.png';
import Avatar from '@/assets/avatar.svg';
import SearchField from '@/components/input-fields/search-fields/serch-field';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/stores/store';
import { logout } from '@/stores/slices/auth/auth-slice';

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const handleClickOutside = (event: { target: any; }) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md">
      <div className="flex items-center gap-4">
        <div className="logo-container flex items-center gap-2">
          <img src={Logo} alt="Logo" className="w-24" />
        </div>
        <SearchField onChange={() => {}} value="" />
      </div>
      <div className="user-info flex items-center gap-4 relative" ref={dropdownRef}>
        <div 
          className="cursor-pointer"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <img
            src={Avatar}
            alt="User"
            className="w-10 h-10 rounded-full"
          />
        </div>
        
        {showDropdown && (
          <div className="absolute right-0 top-12 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
            <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
              <p className="font-medium">User Name</p>
              <p className="text-gray-500 text-xs">user@example.com</p>
            </div>
            <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Profile
            </a>

            <a href="/me/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Settings
            </a>
            <button 
              onClick={() => dispatch(logout())}
              className="block w-full cursor-pointer text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;