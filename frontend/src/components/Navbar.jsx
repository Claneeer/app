import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Home, ShoppingCart, TrendingUp, History, User, LogOut, Building2 } from 'lucide-react';
import { toast } from 'sonner';

const Navbar = ({ user, setUser }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logout realizado com sucesso');
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/buy', label: 'Comprar', icon: ShoppingCart },
    { path: '/sell', label: 'Vender', icon: TrendingUp },
    { path: '/history', label: 'Histórico', icon: History },
    { path: '/profile', label: 'Perfil', icon: User },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="shadow-md" style={{ backgroundColor: '#1E3A8A' }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="text-2xl font-bold text-white flex items-center gap-2" data-testid="navbar-logo">
            <Building2 className="w-7 h-7" />
            BankSys
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                    isActive(item.path)
                      ? 'text-white'
                      : 'text-blue-100 hover:text-white hover:bg-blue-800'
                  }`}
                  style={isActive(item.path) ? { backgroundColor: '#10B981' } : {}}
                  data-testid={`navbar-${item.label.toLowerCase()}`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="text-blue-100 hover:text-white hover:bg-red-600 font-medium ml-2 flex items-center gap-2"
              data-testid="navbar-logout"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2"
            data-testid="navbar-mobile-toggle"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2" data-testid="navbar-mobile-menu">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                    isActive(item.path)
                      ? 'text-white'
                      : 'text-blue-100 hover:text-white hover:bg-blue-800'
                  }`}
                  style={isActive(item.path) ? { backgroundColor: '#10B981' } : {}}
                  data-testid={`navbar-mobile-${item.label.toLowerCase()}`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
            <Button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              variant="ghost"
              className="w-full text-left text-blue-100 hover:text-white hover:bg-red-600 font-medium flex items-center gap-2 justify-start"
              data-testid="navbar-mobile-logout"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;