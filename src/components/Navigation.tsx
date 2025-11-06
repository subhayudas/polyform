import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  X, 
  User, 
  LogOut,
  Settings,
  Package
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, userRole, signOut, profile } = useAuth();
  const navigate = useNavigate();

  // Get user's Google account info - Supabase stores Google OAuth profile picture in user_metadata
  // Check multiple possible locations for the avatar URL (Google OAuth typically uses avatar_url)
  const rawAvatarUrl = 
    user?.user_metadata?.avatar_url || 
    user?.user_metadata?.picture || 
    user?.user_metadata?.avatar || 
    user?.app_metadata?.avatar_url ||
    null;
  
  // Ensure the avatar URL is properly formatted (should be HTTPS for Google profile pictures)
  const userAvatarUrl = rawAvatarUrl && typeof rawAvatarUrl === 'string' && rawAvatarUrl.trim() !== '' 
    ? rawAvatarUrl.trim() 
    : null;
  
  // Get user's name from Google account metadata
  const userName = 
    user?.user_metadata?.full_name || 
    user?.user_metadata?.name || 
    user?.user_metadata?.display_name ||
    profile?.full_name || 
    user?.email?.split('@')[0] || 
    'User';
  
  const userEmail = user?.email || '';

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Materials', href: '/materials' },
    { name: 'Partners', href: '/partners' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-xl fixed z-50 top-4 left-4 right-4 rounded-2xl border border-white/20 dark:border-slate-700/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 sm:h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <div className="w-10 h-10 bg-[#90A955] rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-2xl font-bold text-[#90A955]">PolyForm</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-600 dark:text-gray-300 hover:text-[#90A955] dark:hover:text-[#90A955] px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-[#90A955]/10 dark:hover:bg-[#90A955]/20"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/upload">
                  <Button variant="outline" size="sm">
                    <Package className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        {userAvatarUrl && (
                          <AvatarImage src={userAvatarUrl} alt={userName} />
                        )}
                        <AvatarFallback className="bg-[#90A955] text-white text-xs">
                          {userName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{userName}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            {userAvatarUrl && (
                              <AvatarImage src={userAvatarUrl} alt={userName} />
                            )}
                            <AvatarFallback className="bg-[#90A955] text-white text-xs">
                              {userName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <p className="text-sm font-medium">{userName}</p>
                            <p className="text-xs text-gray-500">{userEmail}</p>
                          </div>
                        </div>
                        {userRole && (
                          <p className="text-xs text-polyform-green-600 capitalize mt-1">{userRole}</p>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                      <Package className="w-4 h-4 mr-2" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <Settings className="w-4 h-4 mr-2" />
                      Profile Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="space-x-3">
                <Link to="/auth">
                  <Button variant="outline" className="border-gray-300 dark:border-gray-600">Sign In</Button>
                </Link>
                <Link to="/auth">
                  <Button className="bg-[#90A955] hover:bg-[#90A955]/90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500 transition duration-150 ease-in-out"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/80 backdrop-blur-md border-t border-white/20 rounded-b-2xl">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-500 hover:text-[#90A955] block px-3 py-2 text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {user ? (
              <>
                <div className="flex items-center space-x-3 px-3 py-3 border-b border-gray-200 dark:border-gray-700 mb-2">
                  <Avatar className="h-10 w-10">
                    {userAvatarUrl && (
                      <AvatarImage src={userAvatarUrl} alt={userName} />
                    )}
                    <AvatarFallback className="bg-[#90A955] text-white">
                      {userName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{userName}</p>
                    <p className="text-xs text-gray-500">{userEmail}</p>
                  </div>
                </div>
                <Link
                  to="/dashboard"
                  className="text-gray-500 hover:text-[#90A955] block px-3 py-2 text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/upload"
                  className="text-gray-500 hover:text-[#90A955] block px-3 py-2 text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Upload
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsOpen(false);
                  }}
                  className="text-gray-500 hover:text-polyform-green-600 block px-3 py-2 text-base font-medium w-full text-left"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="text-gray-500 hover:text-[#90A955] block px-3 py-2 text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
