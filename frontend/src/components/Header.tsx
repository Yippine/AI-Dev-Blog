// Header Component
// Header = Logo + Navigation + UserStatusDisplay
// UserStatusDisplay = (logged_out) -> LoginRegisterButtons | (logged_in) -> UserDropdown

import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import UserDropdown from './user/UserDropdown';

export default function Header() {
  const { isAuthenticated } = useUser();

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
            部落格系統
          </Link>
          <nav className="hidden md:flex space-x-6 items-center">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              首頁
            </Link>
            <Link to="/categories" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              分類
            </Link>
            <Link to="/tags" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              標籤
            </Link>

            {isAuthenticated ? (
              <UserDropdown />
            ) : (
              <div className="flex space-x-3 ml-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  登入
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                >
                  註冊
                </Link>
              </div>
            )}
          </nav>
          <button className="md:hidden text-gray-700 hover:text-blue-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}