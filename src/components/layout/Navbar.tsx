import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ClipboardCheck, Menu, X, LogOut, User, Users, CheckSquare } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center text-primary-500">
              <ClipboardCheck className="h-8 w-8" />
              <span className="ml-2 text-xl font-bold">5S SENAI</span>
            </Link>
          </div>
          
          {isAuthenticated && (
            <>
              <div className="hidden md:block">
                <div className="ml-10 flex items-center space-x-4">
                  <Link 
                    to="/dashboard" 
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/dashboard') 
                        ? 'bg-primary-500 text-white' 
                        : 'text-gray-700 hover:bg-primary-50'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/environments" 
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/environments') 
                        ? 'bg-primary-500 text-white' 
                        : 'text-gray-700 hover:bg-primary-50'
                    }`}
                  >
                    Ambientes
                  </Link>
                  <Link 
                    to="/evaluations" 
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/evaluations') 
                        ? 'bg-primary-500 text-white' 
                        : 'text-gray-700 hover:bg-primary-50'
                    }`}
                  >
                    Avaliações
                  </Link>
                  <Link 
                    to="/calendar" 
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/calendar') 
                        ? 'bg-primary-500 text-white' 
                        : 'text-gray-700 hover:bg-primary-50'
                    }`}
                  >
                    Calendário
                  </Link>
                  <Link 
                    to="/employees" 
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/employees') 
                        ? 'bg-primary-500 text-white' 
                        : 'text-gray-700 hover:bg-primary-50'
                    }`}
                  >
                    Funcionários
                  </Link>
                  <Link 
                    to="/corrective-actions" 
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/corrective-actions') 
                        ? 'bg-primary-500 text-white' 
                        : 'text-gray-700 hover:bg-primary-50'
                    }`}
                  >
                    Ações Corretivas
                  </Link>
                </div>
              </div>
              
              <div className="hidden md:block">
                <div className="ml-4 flex items-center">
                  <div className="relative group">
                    <button className="flex items-center max-w-xs rounded-full text-sm focus:outline-none">
                      <span className="mr-2 text-gray-700">{user?.name}</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src={user?.avatarUrl || 'https://via.placeholder.com/40'}
                        alt="User avatar"
                      />
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <div className="flex items-center">
                          <User className="mr-2 h-4 w-4" />
                          Perfil
                        </div>
                      </Link>
                      <button 
                        onClick={handleLogout} 
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <div className="flex items-center">
                          <LogOut className="mr-2 h-4 w-4" />
                          Sair
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-500 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && isAuthenticated && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white animate-slide-down">
            <Link
              to="/dashboard"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/dashboard') 
                  ? 'bg-primary-500 text-white' 
                  : 'text-gray-700 hover:bg-primary-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/environments"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/environments') 
                  ? 'bg-primary-500 text-white' 
                  : 'text-gray-700 hover:bg-primary-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Ambientes
            </Link>
            <Link
              to="/evaluations"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/evaluations') 
                  ? 'bg-primary-500 text-white' 
                  : 'text-gray-700 hover:bg-primary-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Avaliações
            </Link>
            <Link
              to="/calendar"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/calendar') 
                  ? 'bg-primary-500 text-white' 
                  : 'text-gray-700 hover:bg-primary-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Calendário
            </Link>
            <Link
              to="/employees"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/employees') 
                  ? 'bg-primary-500 text-white' 
                  : 'text-gray-700 hover:bg-primary-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Funcionários
            </Link>
            <Link
              to="/corrective-actions"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/corrective-actions') 
                  ? 'bg-primary-500 text-white' 
                  : 'text-gray-700 hover:bg-primary-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Ações Corretivas
            </Link>
            <Link
              to="/profile"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-primary-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Perfil
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-primary-50"
            >
              Sair
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;