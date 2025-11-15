import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  X, 
  User, 
  LogOut,
  Settings,
  Package,
  ChevronDown,
  Layers3,
  Factory,
  Wrench,
  Zap,
  Box,
  Boxes,
  Hammer,
  Gauge,
  FileText,
  Sparkles
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
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
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

  const handleUploadNavigation = (serviceType?: string) => {
    if (serviceType) {
      navigate(`/upload?service=${serviceType}`);
    } else {
      navigate('/upload');
    }
    setIsOpen(false);
  };

  // Navigation items with dropdown menus
  const navItems = [
    { 
      name: 'Home', 
      href: '/',
      hasDropdown: false
    },
    { 
      name: 'Services', 
      href: '/services',
      hasDropdown: true,
      dropdownItems: [
        { name: '3D Printing', icon: Layers3, serviceType: '3d-printing' },
        { name: 'CNC Machining', icon: Factory, serviceType: 'cnc-machining' },
        { name: 'Sheet Metal', icon: Box, serviceType: 'sheet-metal' },
        { name: 'Prototyping', icon: Wrench, serviceType: 'prototyping' },
        { name: 'Laser Engraving', icon: Zap, serviceType: 'laser-engraving' },
        { name: 'CAD Modeling', icon: Boxes, serviceType: 'cad-modeling' },
      ]
    },
    { 
      name: 'Materials', 
      href: '/materials',
      hasDropdown: true,
      dropdownItems: [
        { name: 'Plastics & Resins', icon: Box, serviceType: 'plastics-resins' },
        { name: 'Metals & Alloys', icon: Factory, serviceType: 'metals-alloys' },
        { name: 'Composites', icon: Layers3, serviceType: 'composites' },
        { name: 'Ceramics', icon: Sparkles, serviceType: 'ceramics' },
        { name: 'Rubber & Silicone', icon: Boxes, serviceType: 'rubber-silicone' },
        { name: 'Custom Materials', icon: Hammer, serviceType: 'custom-materials' },
      ]
    },
    { 
      name: 'Manufacturing', 
      href: '/services',
      hasDropdown: true,
      dropdownItems: [
        { name: 'Rapid Prototyping', icon: Zap, serviceType: 'rapid-prototyping' },
        { name: 'Production Runs', icon: Factory, serviceType: 'production-runs' },
        { name: 'Small Batch', icon: Box, serviceType: 'small-batch' },
        { name: 'Large Scale', icon: Gauge, serviceType: 'large-scale' },
        { name: 'Custom Manufacturing', icon: Wrench, serviceType: 'custom-manufacturing' },
        { name: 'On-Demand', icon: Sparkles, serviceType: 'on-demand' },
      ]
    },
    { 
      name: 'Partners', 
      href: '/partners',
      hasDropdown: false
    },
    { 
      name: 'About', 
      href: '/about',
      hasDropdown: false
    },
    { 
      name: 'Contact', 
      href: '/contact',
      hasDropdown: false
    },
  ];

  return (
    <nav className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-lg fixed z-50 top-0 left-0 right-0 border-b border-gray-200/50 dark:border-gray-800/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <div className="w-10 h-10 bg-[hsl(var(--primary))] rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-2xl font-bold text-[hsl(var(--primary))]">PolyForm</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              if (item.hasDropdown && item.dropdownItems) {
                const isDropdownOpen = openDropdown === item.name;
                return (
                  <div
                    key={item.name}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(item.name)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <Link
                      to={item.href}
                      className="text-gray-700 dark:text-gray-300 hover:text-[hsl(var(--primary))] dark:hover:text-[hsl(var(--primary))] px-4 py-2 text-sm font-semibold transition-all duration-200 rounded-lg hover:bg-[hsl(var(--primary))]/10 dark:hover:bg-[hsl(var(--primary))]/20 flex items-center space-x-1.5 group relative"
                    >
                      <span>{item.name}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </Link>
                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 w-72 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200/50 dark:border-gray-800/50 p-2 z-50 animate-fade-in">
                        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 py-2">
                          {item.name}
                        </div>
                        <div className="h-px bg-gray-200 dark:bg-gray-800 my-1" />
                        <div className="grid grid-cols-1 gap-1">
                          {item.dropdownItems.map((dropdownItem) => {
                            const IconComponent = dropdownItem.icon;
                            return (
                              <button
                                key={dropdownItem.name}
                                onClick={() => handleUploadNavigation(dropdownItem.serviceType)}
                                className="cursor-pointer flex items-center space-x-3 py-3 px-3 rounded-lg hover:bg-[hsl(var(--primary))]/10 dark:hover:bg-[hsl(var(--primary))]/20 transition-all duration-200 hover:translate-x-1 w-full text-left"
                              >
                                <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[hsl(var(--primary))]/10 dark:bg-[hsl(var(--primary))]/20">
                                  <IconComponent className="w-4 h-4 text-[hsl(var(--primary))]" />
                                </div>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{dropdownItem.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-700 dark:text-gray-300 hover:text-[hsl(var(--primary))] dark:hover:text-[hsl(var(--primary))] px-4 py-2 text-sm font-semibold transition-all duration-200 rounded-lg hover:bg-[hsl(var(--primary))]/10 dark:hover:bg-[hsl(var(--primary))]/20"
                >
                  {item.name}
                </Link>
              );
            })}
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
                        <AvatarFallback className="bg-[hsl(var(--primary))] text-white text-xs">
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
                            <AvatarFallback className="bg-[hsl(var(--primary))] text-white text-xs">
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
                  <Button className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
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
        <div className="md:hidden border-t border-gray-200/50 dark:border-gray-800/50">
          <div className="px-2 pt-4 pb-4 space-y-2 sm:px-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md">
            {navItems.map((item) => {
              if (item.hasDropdown && item.dropdownItems) {
                return (
                  <div key={item.name} className="space-y-1 mb-4">
                    <Link
                      to={item.href}
                      className="text-gray-700 dark:text-gray-300 hover:text-[hsl(var(--primary))] block px-3 py-2.5 text-base font-semibold rounded-lg hover:bg-[hsl(var(--primary))]/10 dark:hover:bg-[hsl(var(--primary))]/20 transition-colors mb-2"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                    <div className="text-gray-500 dark:text-gray-400 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                      Quick Upload Options
                    </div>
                    {item.dropdownItems.map((dropdownItem) => {
                      const IconComponent = dropdownItem.icon;
                      return (
                        <button
                          key={dropdownItem.name}
                          onClick={() => handleUploadNavigation(dropdownItem.serviceType)}
                          className="text-gray-700 dark:text-gray-300 hover:text-[hsl(var(--primary))] block px-6 py-3 text-sm font-medium w-full text-left flex items-center space-x-3 hover:bg-[hsl(var(--primary))]/10 dark:hover:bg-[hsl(var(--primary))]/20 rounded-lg transition-all duration-200 active:scale-[0.98]"
                        >
                          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[hsl(var(--primary))]/10 dark:bg-[hsl(var(--primary))]/20">
                            <IconComponent className="w-4 h-4 text-[hsl(var(--primary))]" />
                          </div>
                          <span>{dropdownItem.name}</span>
                        </button>
                      );
                    })}
                  </div>
                );
              }
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-700 dark:text-gray-300 hover:text-[hsl(var(--primary))] block px-3 py-2.5 text-base font-semibold rounded-lg hover:bg-[hsl(var(--primary))]/10 dark:hover:bg-[hsl(var(--primary))]/20 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}
            {user ? (
              <>
                <div className="flex items-center space-x-3 px-3 py-3 border-b border-gray-200 dark:border-gray-700 mb-2">
                  <Avatar className="h-10 w-10">
                    {userAvatarUrl && (
                      <AvatarImage src={userAvatarUrl} alt={userName} />
                    )}
                    <AvatarFallback className="bg-[hsl(var(--primary))] text-white">
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
                  className="text-gray-500 hover:text-[hsl(var(--primary))] block px-3 py-2 text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/upload"
                  className="text-gray-500 hover:text-[hsl(var(--primary))] block px-3 py-2 text-base font-medium"
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
                className="text-gray-500 hover:text-[hsl(var(--primary))] block px-3 py-2 text-base font-medium"
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
