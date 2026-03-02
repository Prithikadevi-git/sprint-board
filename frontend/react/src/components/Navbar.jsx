import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Layout, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) return null; // Hide navbar on Login/Register pages if preferred

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center shadow-sm">
      <Link to="/dashboard" className="flex items-center gap-2 text-xl font-bold text-blue-600">
        <Layout size={24} />
        <span>SprintBoard</span>
      </Link>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <span className="hidden md:block font-medium">{user?.name}</span>
        </div>
        
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-700 transition-colors"
        >
          <LogOut size={18} />
          <span className="hidden md:block">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;