import Logo from '@/assets/logo.png'
import SearchField from "@/components/input-fields/search-fields/serch-field";

const Header = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md">
      <div className="flex items-center gap-4">
        <div className="logo-container flex items-center gap-2">
          <img src={Logo} alt="Logo" className="w-24" />
        </div>
        <SearchField onChange={() => {}} value="" />
      </div>
      <div className="user-info flex items-center gap-4">
        <img
          src="./assets/user.png"
          alt="User"
          className="w-10 h-10 rounded-full"
        />
      </div>
    </header>
  );
};

export default Header;